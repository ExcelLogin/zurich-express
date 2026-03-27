const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User = require('./User');


const apiSchema = new Schema({
  usersdetail:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  balance:{
  type:Number,
  },
  status:{
    type:String,
    default:"Active",
  },
  accountNumber:{
    type:Number,
    default:9678906437,
  }

},
{ id: false },
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});



apiSchema.virtual('Name').get(function() {
  return this.usersdetail.firstname + ' ' + this.usersdetail.lastname;
});








const UserApi =  mongoose.model('UserApi', apiSchema);


module.exports = UserApi