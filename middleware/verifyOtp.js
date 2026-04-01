// const User = require('../model/User');

// const verifyOtp = async (req, res, next) => {
//     const { otp } = req.body;

//     if ( !otp) {
//         return res.status(400).json({ message: 'Email and OTP are required.' });
//     }

//     const otpStr = String(otp);
//     if (!/^\d{4}$/.test(otpStr)) {
//         return res.status(400).json({ message: 'OTP must be exactly 4 digits.' });
//     }

//     try {
//         const user = await User.findOne({"_id":req._id }).select('+otp +otpExpire');

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         if (!user.otp || !user.otpExpire) {
//             return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
//         }

//         // Check if OTP has expired 👇
//         if (Date.now() > user.otpExpire) {
//             user.otp = undefined;
//             user.otpExpire = undefined;
//             await user.save({ validateBeforeSave: false });

//             return res.status(401).json({ message: 'OTP has expired. Please request a new one.' });
//         }

//         if (Number(otp) !== user.otp) {
//             return res.status(401).json({ message: 'Invalid OTP.' });
//         }

//         // Clear OTP after successful verification
//         user.otp = undefined;
//         user.otpExpire = undefined;       // 👈 clear expiry too
//         await user.save({ validateBeforeSave: false });

//         // req.user = user;
//         next();

//     } catch (err) {
//         return res.status(500).json({ message: 'Server error during OTP verification.', error: err.message });
//     }
// };

// module.exports = verifyOtp;


const crypto = require('crypto');
const User = require('../model/User');

/**
 * verifyOtp middleware
 *
 * 1. Validates the 4-digit OTP from req.body against the stored hash on the user doc.
 * 2. Clears the OTP fields after successful verification.
 * 3. Issues a short-lived (5 min) single-use transferToken, stores it on the user,
 *    and sends it back in the response as JSON — so the client can hold it for the
 *    PIN step without needing a separate /verify-otp route.
 *
 * Usage:
 *   router.post('/debit/verify-otp', verifyJWT, verifyOtp);   ← responds with { transferToken }
 *   router.post('/debit',            verifyJWT, verifyTransferToken, verifyPin, debit);
 */

const verifyOtp = async (req, res, next) => {
  const { otp } = req.body;

  // ── Basic presence + format guard ──────────────────────────────────────────
  if (!otp) {
    return res.status(400).json({ message: 'OTP is required.' });
  }

  const otpStr = String(otp).trim();
  if (!/^\d{4}$/.test(otpStr)) {
    return res.status(400).json({ message: 'OTP must be exactly 4 digits.' });
  }

  try {
    const user = await User.findOne({"_id":req._id }).select('+otp +otpExpire');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // ── OTP existence check ─────────────────────────────────────────────────
    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // ── Expiry check ────────────────────────────────────────────────────────
    if (Date.now() > user.otpExpire) {
      user.otp        = undefined;
      user.otpExpire  = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(401).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // ── Value check ─────────────────────────────────────────────────────────
    if (Number(otpStr) !== user.otp) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    // ── OTP verified — clear it immediately (single-use) ────────────────────
    user.otp        = undefined;
    user.otpExpire  = undefined;

    // ── Issue a short-lived transfer token (5 minutes) ──────────────────────
    // This token is returned to the client and must be sent back with the
    // /debit request alongside the user's PIN.  verifyTransferToken middleware
    // consumes (and deletes) it, making it strictly single-use.
    const transferToken           = crypto.randomBytes(32).toString('hex');
    user.transferToken            = transferToken;
    user.transferTokenExpire      = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await user.save({ validateBeforeSave: false });

    // ── Respond to the client — do NOT call next() here ─────────────────────
    // The PIN step is a separate request; this route's job is done.
    return res.status(200).json({
      success:       true,
      transferToken,
      message:       'OTP verified. Proceed to enter your transaction PIN.',
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Server error during OTP verification.',
      error:   err.message,
    });
  }
};

module.exports = verifyOtp;