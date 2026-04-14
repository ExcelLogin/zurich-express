const TransferHistory= require('../model/TransferHistory');
const UserDetails = require('../model/UserData');
const User = require('../model/User');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
const CustomError = require('../Utils/CustomError');
const sendEmail = require('../Utils/email');




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



//credit user 

const creditUser =asyncErrorHandler(async (req, res, next) => {


  const { beneficiaryName, accountNumber, bankName, amountTransferred, purposeOfTransfer, type } = req.body;


 const user = await User.findOne({"_id":req.params.id})


 console.log(user.email)



  if(!user){
     const error = new CustomError('This user account is not found', 401);
                return next(error);
  }
   




  try {
    // 1. Build the document in memory — does NOT hit the database yet
    const transfer = new TransferHistory({
      uniqId: req.params.id,
      beneficiaryName,
      accountNumber,
      bankName,
      amountTransferred,
      purposeOfTransfer,
      type
    });

    // 2. Deduct balance — if this throws (insufficient funds, user not found),
    //    the transfer document is never saved
    const updatedAccount = await transfer.creditBalance();

    // 3. Only persist the transfer record once balance deduction succeeded
    await transfer.save();


   await sendEmail({
            email: user.email,
            subject: 'Credit',
            message: `Hi <br>  ${user.firstname} your account has been credited`,
        });


    res.status(201).json({
      success: true,
      newBalance: updatedAccount.balance
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
  

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
    creditUser,
    getUsersTfhistory,
    UpdateUserHistory
    // upDateUsers,
    // upDateUser

}