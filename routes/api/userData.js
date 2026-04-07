const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
const userDataController = require('../../Controllers/userDataController');




router.route('/add').post(userDataController.add);
router.route('/subtract').post(userDataController.subtract);

router.route('/').get(verifyRoles(ROLES_LIST.Editor),userDataController.getUser )



router.route('/transfers').get(verifyRoles(ROLES_LIST.Editor),userDataController.getTfhistory )


module.exports = router;