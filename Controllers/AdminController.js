const TransferHistory= require('../model/TransferHistory');
const UserDetails = require('../model/UserData');
const User = require('../model/User');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
const CustomError = require('../Utils/CustomError');





//get the main users details without populate for general update.
const getMainUserData = asyncErrorHandler(async (req, res, next) => {

    const users = await User.find()
     .select('-roles  -refreshToken -passwordResetToken -passwordResetTokenExpire');

    if (!users || users.length === 0) {
        const error = new CustomError('No Users account found', 404);
        return next(error);
    }

    res.status(200).json({
        status: 'success',
        data: users
    });
});






  //
const getUser = asyncErrorHandler(async (req, res,next) => {

    const userD = await UserDetails.findOne({ 'usersdetail' : req.params.id}) //await User.findById(req.params.id)
    .select('-_id -id')
    .populate('usersdetail',"firstname email lastname country ").select('-__v')
    .select('-_id -id').exec();

  if(!userD){
     const error = new CustomError('Account with that ID is not found!', 404);
                return next(error);
  }
   
 res.status(200).json({
        'status':'success',
         data:{
           userD
         }
    });
}
) 

//
const getUsers = asyncErrorHandler(async(req, res, next)=> {
    
    const userD = await UserDetails.find()
     .select('-_id -id')
    .populate('usersdetail',"firstname email lastname country").select('-__v')
    .select('-_id -id').exec();
  
   res.status(200).json({
        status: 'success',
        userD
    });

}

) 



//
const add = asyncErrorHandler(async (req, res, next) => {

  const { balance } = req.body;
 
  const returnbalance = await UserDetails.findOne({ 'usersdetail' : req.params.id});

  if (!returnbalance) {
    const error = new CustomError('Invalid Account ID', 404);
        return next(error);
    } else {
      returnbalance.balance += +balance; // Add amount to existing balance
      await returnbalance.save();
  }

    res.status(200).json({
      status: "success balance updated",
      data:{
      returnbalance
      },
      });

 
}
) 




//
const subtract = asyncErrorHandler(async (req, res, next) => {
  const { balance } = req.body;

  let returnbalance = await UserDetails.findOne({ 'usersdetail' : req.params.id});


    if (!returnbalance ) {
     const error = new CustomError('Account with that ID is not found!', 404);
        return next(error);
    }

    if (returnbalance.balance < balance) {
       const error = new CustomError('Insufficient balance!', 401);
        return next(error);
    }

    returnbalance.balance -= balance; // Subtract amount from existing balance
    await returnbalance.save();



      res.status(200).json({
      status: "Balance updated",
      data:{
        returnbalance
      },
      });

})




const getUsersTfhistory = asyncErrorHandler(async (req, res,next) => {

    const tfHistories = await TransferHistory.find({})
    .populate('uniqId', '_id')
    .select('-id').exec();

  if(!tfHistories){
     const error = new CustomError('No histories yet', 404);
                return next(error);
  }
   
 res.status(200).json({
        'status':'success',
         data:tfHistories
    });
}
) 



//
const UpdateUserHistory = asyncErrorHandler(async (req, res,next) => {


const history = await TransferHistory.findOneAndUpdate({ "_id": req.params.id},{ ...req.body  },  // ← use $set and target `status` field
    { returnDocument: 'after', runValidators: true } );


  if(!history){
     const error = new CustomError('No histories yet', 404);
                return next(error);
  }
   

 res.status(200).json({
        'status':'success',
         data:history
    });



}
) 








module.exports = {
  getMainUserData,
    getUser,
    getUsers,
    add,
    subtract,
    getUsersTfhistory,
    UpdateUserHistory
    // upDateUsers,
    // upDateUser

}