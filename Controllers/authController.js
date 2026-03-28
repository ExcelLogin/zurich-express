
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const CustomError = require('../Utils/CustomError');
const sendEmail = require('../Utils/email');
const asyncErrorHandler = require('../Utils/asyncErrorHandlers');




const handleLogin = async (req, res) => {
    
 const cookies = req.cookies;
    const { email, password} = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    try {
        // evaluate password 
        const foundUser = await User.findOne({ email }).select("+password");


        if(!foundUser || !(await foundUser.comparePasswordInDb(password, foundUser.password))){
            res.status(401).json({ 'message': 'wrong email or password.' });
        } else {
            const roles = Object.values(foundUser.roles).filter(Boolean);
            // create JWTs
            const accessToken = jwt.sign(
                {
                   "UserInfo": {
                    "_id":foundUser._id,
                    "email": foundUser.email,
                    "roles": roles
                }
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            const  newRefreshToken = jwt.sign(
                { "email": foundUser.email,
                     "_id":foundUser._id
                 },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );


            let newRefreshTokenArray =
                !cookies?.jwt
                    ? foundUser.refreshToken
                    : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

               if (cookies?.jwt) {

                /* 
                Scenario added here: 
                    1) User logs in but never uses RT and does not logout 
                    2) RT is stolen
                    3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                */
                const refreshToken = cookies.jwt;
                const foundToken = await User.findOne({ refreshToken }).exec();

                // Detected refresh token reuse!
                if (!foundToken) {
                    // clear out ALL previous refresh tokens
                    newRefreshTokenArray = [];
                }

                res.clearCookie('jwt', { httpOnly: true,secure: true , sameSite: 'None', }); //secure: true 
            }


            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

            // Saving refreshToken with current user
            const  user = await foundUser.save({ validateBeforeSave:false});

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true,sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //secure: true,

            // Send authorization roles and access token to user
    
            res.status(200).json({accessToken });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
}






//forgot route controller 

const forgotPassword = asyncErrorHandler (async(req,res,next)=>{
      const { email } = req.body;
    //1 GET USER BASED ON POSTED EMAIL 
    const user = await User.findOne({ email})
    if(!user){
        const error = new CustomError('We could not find the user with given email!', 404);
        return next(error);
    }
 

    //GENERATE A RANDOM RESET TOKEN 
    const resetToken = user.createResponseResetPasswordToken()

    await user.save({validateBeforeSave:false});


    //SEND THE TOKEN BACK TO THE USER EMAIL
    const resetUrl = `${req.protocol}://${req.get('host')}/auth/resetPassword/${resetToken}`
    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis. reset password link will be valid only for 10mins`
   

   try{
    await sendEmail({
        email:user.email,
        subject:"password change request received",
        message:message
    });

   res.status(200).json({
    status:"success",
    message:'password reset link send to user email'
   })

   }catch(err){
     user.passwordResetToken = undefined;
     user.passwordResetTokenExpire=undefined;
     user.save({validateBeforeSave:false});

    //  return res.status(500).json({message:err.message});
    console.error('EMAIL ERROR:', err);
return res.status(500).json({ message: err.message, stack: err.stack });

   }
    

}
) 


const resetPassword = async(req, res,next) => {
const {password,confirmpassword}=req.body;

  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
   const user = await User.findOne({ passwordResetToken:token, passwordResetTokenExpire:{$gt:Date.now()}})

    if(!user){
        const error = new CustomError('Token is invalid or has expired', 404);
        return next(error);
    }  

  user.password =password;
  user.confirmpassword = confirmpassword;
  user.passwordResetToken =undefined;
  user.passwordResetTokenExpire =undefined;
  user.passwordChangedAt = Date.now();


 user.save()

  res.status(200).json({
    status:"succes",
    message:user
  })


}













module.exports = {   
    handleLogin,
    forgotPassword,
    resetPassword
};