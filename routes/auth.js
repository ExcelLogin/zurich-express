const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');





router.post('/', authController.handleLogin);

router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword/:token').patch(authController.resetPassword )





module.exports = router;