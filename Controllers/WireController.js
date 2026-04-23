const WireApi = require('../model/WireTransfer');
const User = require('../model/User');
const sendEmail = require('../Utils/email');

// Step 1: Generate & email OTP
// const initiateWireDebit = async (req, res) => {
//   try {
//     const user = await User.findOne({"_id":req._id});
//     if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

//     const otp = await user.createOtp();

//     await sendEmail({
//       email: user.email,
//       subject: 'Your Wire Transfer OTP',
//       message: `Your OTP is ${otp}`,
//     });

//     res.status(200).json({ success: true, message: 'OTP sent to your registered email.' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Step 1: Generate & email OTP
const initiateWireDebit = async (req, res) => {
  try {
    const user = await User.findOne({ "_id": req._id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
 
    const otp = await user.createOtp();
 
    await sendEmail({
      email:        user.email,
      firstname:    user.firstname,
      subject:      'Your Wire Transfer OTP',
      message:      `Your OTP is ${otp}. It expires in 10 minutes.`,
      templateName: 'otp',  // ← use otp_template.html
      otp,                  // ← pass otp value into template
    });
 
    res.status(200).json({ success: true, message: 'OTP sent to your registered email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






// Step 3: Execute wire transfer (after verifyTransferToken + verifyPin middleware)
// const wireDebit = async (req, res) => {
//   const {
//     beneficiaryName,
//     accountNumber,
//     bankName,
//     bankAddress,
//     routingNumber,
//     swiftCode,
//     iban,
//     amountTransferred,
//     purposeOfTransfer,
//     type,
//   } = req.body;

//   try {
//     const transfer = new WireApi({
//       uniqId: req._id,
//       beneficiaryName,
//       accountNumber,
//       bankName,
//       bankAddress,
//       routingNumber,
//       swiftCode,
//       iban,
//       amountTransferred,
//       purposeOfTransfer,
//       type,
//     });

//     const updatedAccount = await transfer.deductBalance();
//     await transfer.save();

//     res.status(201).json({
//       success: true,
//       transfer,
//       newBalance: updatedAccount.balance,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };


// Step 3: Execute wire transfer (after verifyTransferToken + verifyPin middleware)
const wireDebit = async (req, res) => {
  const {
    beneficiaryName,
    accountNumber,
    bankName,
    bankAddress,
    routingNumber,
    swiftCode,
    iban,
    amountTransferred,
    purposeOfTransfer,
    type,
  } = req.body;
 
  try {
    // 1. Fetch authenticated user  ← was missing in original
    const user = await User.findOne({ "_id": req._id });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
 
    // 2. Build transfer document (not saved yet)
    const transfer = new WireApi({
      uniqId: req._id,
      beneficiaryName,
      accountNumber,
      bankName,
      bankAddress,
      routingNumber,
      swiftCode,
      iban,
      amountTransferred,
      purposeOfTransfer,
      type,
    });
 
    // 3. Deduct balance — throws if insufficient funds
    const updatedAccount = await transfer.deductBalance();
 
    // 4. Persist only after successful deduction
    await transfer.save();
 
    // 5. Send debit notification email
    await sendEmail({
      email:             user.email,
      firstname:         user.firstname,
      subject:           'Wire Transfer Alert',
      message:           `Hi ${user.firstname}, $${amountTransferred} has been debited from your account.`,
      amountTransferred,  // ← triggers debit_template.html
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







module.exports = { initiateWireDebit, wireDebit };