const User = require('../model/User');
const UserApi= require('../model/UserData');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
     const { email, password,confirmpassword, ...rest} = req.body;

     if (!email || !password || !confirmpassword ) return res.status(400).json({ 'message': 'Email and password are required.' });
   
  
 //check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const user = await User.create({
            email,
            password,
            confirmpassword,
            ...rest
        });

         await UserApi.create({
        usersdetail: user._id,
        balance:0.00,
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