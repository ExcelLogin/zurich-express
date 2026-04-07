const UserDetails = require('../model/UserData');
const TransferApi = require('../model/TransferHistory');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');
const CustomError = require('../Utils/CustomError');

// Route to add to the account balance

const add = asyncErrorHandler(async (req, res, next) => {

  const { balance } = req.body;
 
  const returnbalance = await UserDetails.findOne({ 'usersdetail' : req._id});

  if (!returnbalance) {
    const error = new CustomError('Invalid Account ID', 404);
        return next(error);
    } else {
      returnbalance.balance += +balance; // Add amount to existing balance
      await returnbalance.save();
  }

    res.status(200).json({
      status: "success",
      data:{
      returnbalance:returnbalance.balance
      },
      });

 
}
) 


const subtract = async (req, res, next) => {
  const { balance } = req.body;

  let userD = await UserDetails.findOne({ 'usersdetail' : req._id});


    if (!userD) {
     const error = new CustomError('Account with that ID is not found!', 404);
        return next(error);
    }

    if (userD.balance < balance) {
       const error = new CustomError('Insufficient balance!', 401);
        return next(error);
    }

    userD.balance -= balance; // Subtract amount from existing balance
    await userD.save();



      res.status(200).json({
      status: "Balance updated",
      data:{
       balance: userD.balance 
      },
      });

    // res.json({ message: 'Balance updated', balance: userD.balance });

}


const getUser = asyncErrorHandler(async (req, res, next) => {
 
    const userD = await UserDetails.findOne({ 'usersdetail' :req._id})
    .select('-_id -id')
    .populate('usersdetail',"firstname email lastname country balance accounttype dateofbirth phonenumber houseaddress").select('-__v ')
    .select('-_id -_id -__v').exec();

  
  if(!userD){
    const error = new CustomError('Account with that ID is not found!', 404);
    return next(error);
  }
   

   const plainObject = userD.toObject();

    const details = {
      _id : plainObject.usersdetail._id,
      accountNumber: plainObject.accountNumber,
      balance:plainObject.balance,
      status:plainObject.status,
      email:plainObject.usersdetail.email,
      firstname:plainObject.usersdetail.firstname,
      lastname: plainObject.usersdetail.lastname,
      country : plainObject.usersdetail.country,
      accounttype: plainObject.usersdetail.accounttype,
      dateofbirth: plainObject.usersdetail.dateofbirth,
      phonenumber:plainObject.usersdetail.phonenumber,
      houseaddress:plainObject.usersdetail.houseaddress
    }

    res.status(200).json({ success: true, data: details })

}

) 


const getTfhistory = asyncErrorHandler(async(req, res, next) => {


let userTfhistory = await TransferApi.find({ 'uniqId' : req._id}).select('-_id  -__v');

    if (!userTfhistory ) {
     const error = new CustomError('User has no history', 404);
        return next(error);
    }

 res.status(200).json({ success: true, data: userTfhistory  })


})














module.exports = {
    add,
    getUser,
    subtract,
    getTfhistory
}
