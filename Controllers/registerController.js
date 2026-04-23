const User = require('../model/User');
const UserApi= require('../model/UserData');
// const bcrypt = require('bcrypt');
const connectDB = require('../config/dbConn');
const sendEmail = require('../Utils/email');







const handleNewUser = async (req, res) => {
     await connectDB(); 
     const { email, password,confirmpassword, ...rest} = req.body;

     if (!email || !password || !confirmpassword ) return res.status(400).json({ 'message': 'Email and password are required.' });
   
  

    try {
       //check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
        if (duplicate) return res.sendStatus(409);
        //encrypt the password
        const user = await User.create({
            email,
            password,
            confirmpassword,
            ...rest
        });

         await UserApi.create({
        usersdetail: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        balance:0.00,
        });


//    await sendEmail({
//             email: user.email,
//             subject: 'Congratulation on your new Account',
//             message: `Hi ${user.firstname}  Congratulation you have a successfully created a new account with westernzurich bank`,
//         });

await sendEmail({
  email: user.email,
  subject: 'Congratulations on your new Account',
  firstname: user.firstname,
  loginUrl: 'https://westernzurich.online/login',
  message: `Hi ${user.firstname}, welcome to Western Zurich Bank.`,
});







      
        res.status(201).json({
             'status': 'success',
             data:{
               user:`New user ${user.email} created!` 
             }
            });
    } catch (err) {
        res.status(400).json({
            status :'fail',
            message: err.message
        })
    }

}

module.exports = { handleNewUser };