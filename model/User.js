
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');



const userSchema = new Schema({
firstname: {
        type: String,
       required: [true, 'First name is required field!']
    },
lastname: {
        type: String,
        required:  [true, 'Last name is required field!']
    },
middlename: {
        type: String,
        required: [true, 'Middle name is required field!']
    },
address: {
        type: String,
        required:  [true, 'Address is required field!']
    },
country: {
        type: String,
        required:  [true, 'Country is required field!']
    },
state: {
        type: String,
        required:  [true, 'State is required field!']
    },
city: {
        type: String,
        required:  [true, 'City is required field!']
    },
zipcode: {
        type: Number,
        required:  [true, 'Zip code is required field!']
    },
dateofbirth: {
        type: Date,
        required:  [true, 'Date of birth is required field!']
    },
  
phonenumber: {
        type: Number,
        required:  [true, 'Phone number is a required field!']
    },
email: {
        type: String,
        required:  [true, 'Email is a required field!'],
        unique:true,
        lowercase:true,
        validate :[validator.isEmail, 'Please enter a valid email']
    },
ssn: {
        type: Number,
        required:  [true, 'SSN is required field!']
    },
 accounttype: {
    type: String,
    enum: ['checking', 'savings'],  // lowercase to match frontend
    required: true
},
   
    currency: {
        type: String,
        required: [true, 'Currency is required field!']
    },

  status:{
    type:String,
    enum: ['Active', 'Inactive','Blocked'], 
    default:"Active",
  },

password: {
        type: String,
        required:  [true, 'Password is required field!'],
        minlength:8
       
    },
confirmpassword: {
        type: String,
        required: [true, 'Confirm password is required field!'],
        validate : {
            validator: function(val){
             return  val === this.password;
            },
        message : 'password and confirmpassword does not match'
        }
       
    },
roles: {
        User: {
            type: Number,
            default: 2001 
        },
Editor:{
            type: Number,
            default: 1984
        },
        Admin: Number,
    },
 refreshToken: [String],

passwordChangedAt:Date,

passwordResetToken:String,
    
passwordResetTokenExpire:Date,

pin: { type: Number},
transferToken: { type: String, select: false },
transferTokenExpire: { type: Date, select: false },

otp: {
        type: Number,
        // required:  [true, 'Pin is required field!']
    },
otpExpire: {         
    type: Date,
},

},
{ id: false }
);



userSchema.pre('save', async function() {

 // Auto-generate 4-digit PIN for new users
    if (this.isNew && !this.pin) {
        this.pin = Math.floor(1000 + Math.random() * 9000);
    }

    if (!this.isModified('password')) return;
    
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmpassword = undefined;
});


userSchema.methods.comparePasswordInDb = async function(pswd, psdDb){
        return await bcrypt.compare(pswd, psdDb);
}





 userSchema.methods.createResponseResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(32).toString('hex');

   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000 ;


//    console.log(resetToken, this.passwordResetToken)

   return resetToken;

}




userSchema.methods.createOtp = async function () {
    const otp = Math.floor(1000 + Math.random() * 9000);

    this.otp = otp;
    this.otpExpire = Date.now() + 5 * 60 * 1000; // expires in 5 minutes 👈

    await this.save({ validateBeforeSave: false });

    return otp;
};







const User = mongoose.model('User', userSchema);

module.exports = User














    // {
    //     "firstname":"jenny",
    //     "lastname":"Rochas",
    //     "middlename":"princess",
    //     "address":"naizi's street",
    //     "country":"Englang",
    //     "state":"anston villa",
    //     "city":"cardiffe",
    //     "zipcode":"1856",
    //     "dateofbirth":"1990",
    //     "houseaddress":"naizistreet",
    //     "phonenumber":"08946465673",
    //     "email":"krimkrim.id@gmail.com",
    //     "occupation":"Bnaker",
    //     "annualincome":"800k",
    //     "ssn":"989653",
    //     "accounttype":"Checking",
    //     "currency":"usd",
    //     "pin":"4674768",
    //     "password":"test1234",
    //     "confirmpassword":"test1234",
    //     "passport":"Richie luuuxxx"

    // }