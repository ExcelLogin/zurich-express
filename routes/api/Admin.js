const express = require('express');
const router = express.Router();
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');
// const userDataController = require('../../Controllers/userDataController');
const AdminController = require('../../Controllers/AdminController');






 router.route('/usermaindata').get(verifyRoles(ROLES_LIST.Admin),AdminController.getMainUserData )


 router.route('/users').get(verifyRoles(ROLES_LIST.Admin),AdminController.getUsers )


router.route('/transfers').get(verifyRoles(ROLES_LIST.Admin),AdminController.getUsersTfhistory )


router.route('/wires').get(verifyRoles(ROLES_LIST.Admin),AdminController.getWireHistorys )



router.route('/user/:id')
    .get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.getUser)


router.route('/add/:id')
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.add)


router.route('/subtract/:id')
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.subtract)


router.route('/transfer/:id')
    .patch(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.UpdateUserHistory)


router.route('/wire/:id')
    .patch(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.UpdateWireHistory)





router.route('/credit/:id')
    .post(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.creditUser)



router.route('/status/:id')
    .patch(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.updateUserStatus)

    // router.route('/updateUsers')
    // .put(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.Editor),AdminController.upDateUsers)



    module.exports = router;