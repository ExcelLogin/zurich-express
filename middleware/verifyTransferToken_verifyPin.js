const User = require('../model/User');

/**
 * verifyTransferToken middleware
 *
 * Checks that the transferToken sent with the /debit request:
 *   - exists on the user document
 *   - matches exactly
 *   - has not expired (5-minute window set by verifyOtp)
 *
 * Deletes the token on first use (strictly single-use).
 * Attaches nothing extra to req — verifyPin runs next.
 */
const verifyTransferToken = async (req, res, next) => {
  const { transferToken } = req.body;

  if (!transferToken) {
    return res.status(400).json({ message: 'Transfer token is required.' });
  }

  try {
    const user = await User.findOne({"_id":req._id }).select('+transferToken +transferTokenExpire');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.transferToken || !user.transferTokenExpire) {
      return res.status(401).json({
        message: 'No active transfer session. Please verify your OTP again.',
      });
    }

    if (Date.now() > user.transferTokenExpire) {
      user.transferToken        = undefined;
      user.transferTokenExpire  = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({
        message: 'Transfer session has expired. Please verify your OTP again.',
      });
    }

    if (transferToken !== user.transferToken) {
      return res.status(401).json({ message: 'Invalid transfer token.' });
    }

    // ── Consume the token (single-use) ──────────────────────────────────────
    user.transferToken        = undefined;
    user.transferTokenExpire  = undefined;
    await user.save({ validateBeforeSave: false });

    next();

  } catch (err) {
    return res.status(500).json({
      message: 'Server error during transfer session verification.',
      error:   err.message,
    });
  }
};


/**
 * verifyPin middleware
 *
 * Validates the numeric transaction PIN from req.body against
 * the value stored in the User document (field: pin, type: Number).
 *
 * Must run AFTER verifyTransferToken.
 */
const verifyPin = async (req, res, next) => {
  const { pin } = req.body;

  if (pin === undefined || pin === null || pin === '') {
    return res.status(400).json({ message: 'Transaction PIN is required.' });
  }

  const pinStr = String(pin).trim();
  if (!/^\d{4}$/.test(pinStr)) {
    return res.status(400).json({ message: 'PIN must be exactly 4 digits.' });
  }

  try {
    const user = await User.findOne({"_id":req._id }).select('+pin');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.pin === undefined || user.pin === null) {
      return res.status(400).json({
        message: 'No transaction PIN is set on this account. Please contact support.',
      });
    }

    if (Number(pinStr) !== user.pin) {
      return res.status(401).json({ message: 'Incorrect transaction PIN.' });
    }

    next();

  } catch (err) {
    return res.status(500).json({
      message: 'Server error during PIN verification.',
      error:   err.message,
    });
  }
};


module.exports = { verifyTransferToken, verifyPin };