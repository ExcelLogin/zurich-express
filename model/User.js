
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
    houseaddress: {
        type: String,
        required: true
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
    occupation: {
        type: String,
        required:  [true, 'Occupation is required field!']
    },
    annualincome: {
        type: String,
        required:  [true, 'Annual income is required field!']
    },
    ssn: {
        type: Number,
        required:  [true, 'SSN is required field!']
    },
    accounttype: {
        type: String,
        required: [true, 'Account type is required field!']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required field!']
    },
    pin: {
        type: Number,
        // required:  [true, 'Pin is required field!']
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
    passport:{
        type: String,
    },
   roles: {
    type: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: {
            type: Number,
            default: 1984
        },
        Admin: Number,
    },
    select: false  
},
     refreshToken: [String],

    passwordChangedAt:Date,
     passwordResetToken:String,
     passwordResetTokenExpire:Date

}, { id: false }
);

    userSchema.pre('save', async function(next){

    if(!this.isModified('password')) return next()
            //encrypt password
    this.password =  await bcrypt.hash(this.password, 12);

    this.confirmpassword = undefined;

    next()
    })


    // userSchema.methods.comparePasswordInDb = async function(pswd, psdDb){
    //     return await bcrypt.compare(pswd, psdDb);
    // }




//  userSchema.methods.createResponseResetPasswordToken = function(){

//     const resetToken = crypto.randomBytes(32).toString('hex');

//    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
//    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000 ;


// //    console.log(resetToken, this.passwordResetToken)

//    return resetToken;

//     }




    const User = mongoose.model('User', userSchema);

module.exports = User