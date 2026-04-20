const express = require('express');
const router = express.Router();
const verifyOtp = require('../../middleware/verifyOtp');
const { verifyTransferToken, verifyPin } = require('../../middleware/verifyTransferToken_verifyPin');
const wireTransferController = require('../../Controllers/WireController');

// Step 1: Send OTP to email
router.route('/wire/initiate').post(wireTransferController.initiateWireDebit);

// Step 2: Verify OTP → returns short-lived transferToken
router.route('/wire/verify-otp').post(verifyOtp);

// Step 3: Execute transfer (requires transferToken + PIN)
router.route('/wire').post(verifyTransferToken, verifyPin, wireTransferController.wireDebit);

module.exports = router;