const TransferHistory= require('../model/TransferHistory');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
 const CustomError = require('../Utils/CustomError');
const User = require('../model/User'); // adjust path as needed
const sendEmail = require('../Utils/email');
const crypto = require('crypto');


//  Generate & email OTP before debit


const initiateDebit = async (req, res) => {
    try {
        const user = await User.findOne({"_id":req._id});  // use your existing auth id

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        const otp = await user.createOtp();

        await sendEmail({
            email: user.email,
            subject: 'Your Transaction OTP',
            message: `you otp is ${otp}`,
        });

        res.status(200).json({ success: true, message: 'OTP sent to your registered email.' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// const issueTransferToken = async (req, res) => {
//   try {
//     const user = await User.findOne({"_id":req._id });
//     if (!user) return res.status(404).json({ message: 'User not found.' });

//     // Short-lived token (5 min) stored on user doc
//     const token = crypto.randomBytes(32).toString('hex');
//     user.transferToken = token;
//     user.transferTokenExpire = Date.now() + 5 * 60 * 1000;
//     await user.save({ validateBeforeSave: false });

//     res.status(200).json({ success: true, transferToken: token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




// debit 

const debit = async (req, res) => {
  const { beneficiaryName, accountNumber, bankName, amountTransferred, purposeOfTransfer, type } = req.body;

  try {
    // 1. Build the document in memory — does NOT hit the database yet
    const transfer = new TransferHistory({
      uniqId: req._id,
      beneficiaryName,
      accountNumber,
      bankName,
      amountTransferred,
      purposeOfTransfer,
      type
    });

    // 2. Deduct balance — if this throws (insufficient funds, user not found),
    //    the transfer document is never saved
    const updatedAccount = await transfer.deductBalance();

    // 3. Only persist the transfer record once balance deduction succeeded
    await transfer.save();

    res.status(201).json({
      success: true,
      transfer,
      newBalance: updatedAccount.balance
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


module.exports = {
 debit,
initiateDebit,
// issueTransferToken 
}