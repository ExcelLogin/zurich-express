const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const verifyOtp = require('../../middleware/verifyOtp')
// const verifyPin = require('../../middleware/verifyPin')
// const verifyTransferToken = require('../../middleware/verifyTransferToken')
const { verifyTransferToken, verifyPin } = require('../../middleware/verifyTransferToken_verifyPin');
const transferController = require('../../Controllers/transferController');





// Verifies OTP only, returns a short-lived transfer token
router.route('/debit/verify-otp').post(verifyOtp);



router.route('/debit/initiate').post(transferController.initiateDebit); 


// Final debit now requires transferToken + PIN instead of OTP
router.route('/debit').post(verifyTransferToken, verifyPin, transferController.debit);


// router.route('/debit').post(verifyOtp,transferController.debit);



module.exports = router;