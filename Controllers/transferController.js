const TransferHistory= require('../model/TransferHistory');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
 const CustomError = require('../Utils/CustomError');
const User = require('../model/User'); // adjust path as needed
const sendEmail = require('../Utils/email');
const crypto = require('crypto');


//  Generate & email OTP before debit


// const initiateDebit = async (req, res) => {
//     try {
//         const user = await User.findOne({"_id":req._id});  // use your existing auth id

//         if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//         const otp = await user.createOtp();

//         await sendEmail({
//       email:     user.email,
//       firstname: user.firstname,
//       subject:   'Your Transaction OTP',
//       message:   `Your OTP is ${otp}. It expires in 10 minutes.`,
//     });

//         res.status(200).json({ success: true, message: 'OTP sent to your registered email.' });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

const initiateDebit = async (req, res) => {
    try {
        const user = await User.findOne({"_id":req._id});

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        const otp = await user.createOtp();

        await sendEmail({
            email:        user.email,
            firstname:    user.firstname,
            subject:      'Your Transaction OTP',
            message:      `Your OTP is ${otp}. It expires in 10 minutes.`,
            templateName: 'otp',   // ← tells email.js to use otp_template.html
            otp,                   // ← passes otp value into the template
        });

        res.status(200).json({ success: true, message: 'OTP sent to your registered email.' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};







// debit 

// const debit = async (req, res) => {
//   const { beneficiaryName, accountNumber, bankName, amountTransferred, purposeOfTransfer, type } = req.body;

//   try {
//     // 1. Build the document in memory — does NOT hit the database yet
//     const transfer = new TransferHistory({
//       uniqId: req._id,
//       beneficiaryName,
//       accountNumber,
//       bankName,
//       amountTransferred,
//       purposeOfTransfer,
//       type
//     });

//     // 2. Deduct balance — if this throws (insufficient funds, user not found),
//     //    the transfer document is never saved
//     const updatedAccount = await transfer.deductBalance();

//     // 3. Only persist the transfer record once balance deduction succeeded
//     await transfer.save();




//    await sendEmail({
//             email: user.email,
//             subject: 'Debit',
//             message: `Hi <br>  ${user.firstname} Have been debited from your account`,
//         });



    

//     res.status(201).json({
//       success: true,
//       transfer,
//       newBalance: updatedAccount.balance
//     });

//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };




const debit = async (req, res) => {
  const { beneficiaryName, accountNumber, bankName, amountTransferred, purposeOfTransfer, type } = req.body;
 
  try {
    // 1. Fetch the authenticated user  ← was missing entirely in original
    const user = await User.findOne({"_id":req._id});
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
 
    // 2. Build transfer document (not saved yet)
    const transfer = new TransferHistory({
      uniqId: req._id,
      beneficiaryName,
      accountNumber,
      bankName,
      amountTransferred,
      purposeOfTransfer,
      type,
    });
 
    // 3. Deduct balance — throws if insufficient funds
    const updatedAccount = await transfer.deductBalance();
 
    // 4. Persist transfer only after successful deduction
    await transfer.save();
 
    // 5. Send debit notification email
    await sendEmail({
      email:             user.email,
      firstname:         user.firstname,
      subject:           'Debit Transaction Alert',
      message:           `Hi ${user.firstname}, $${amountTransferred} has been debited from your account.`,
      // template variables
      amountTransferred,
      beneficiaryName,
      accountNumber,
      bankName,
      purposeOfTransfer,
      type,
      newBalance:        updatedAccount.balance,
      privacyUrl:        'https://westernzurich.online/privacy',
      termsUrl:          'https://westernzurich.online/terms',
    });
 
    res.status(201).json({
      success:    true,
      transfer,
      newBalance: updatedAccount.balance,
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