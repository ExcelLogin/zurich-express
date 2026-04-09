const User = require('../model/User');
util =require('util');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
const CustomError = require('../Utils/CustomError');
// const jwt = require('jsonwebtoken');






// const getAllUsers = asyncErrorHandler(async (req, res, next) => {

//  const users = await User.find().select("-password -confirmpassword -roles");

//    res.status(200).json({
//         status: 'success',
//         length: users.length,
//         data: {
//            users
//         }
//     });

// })



const getUser = asyncErrorHandler( async(req, res, next) => {

        const user = await User.findById(req.params.id)

        if(!user){
             const error = new CustomError('Account with that ID is not found!', 404);
                return next(error);
        }

    res.status(200).json({
        'status':'success',
         data:{
            user
         }
    });

}
)



module.exports = {
    // getAllUsers,
    getUser,
    // forgotPassword,
    // resetPassword
}