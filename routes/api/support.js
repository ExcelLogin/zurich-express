const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const supportController = require('../../Controllers/supportController');
// const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
// const CustomError = require('../Utils/CustomError');
// const sendEmail = require('../Utils/email');




router.route('/ticket')
    .post(supportController.support)

    module.exports = router;