const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const transferSchema = new Schema({
  uniqId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  beneficiaryName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Successful', 'Failed'],
    default: 'Pending',
  },
  accountNumber: {
    type: Number,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  refCode: {
    type: String,
    unique: true,
    default: () => `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
  dateOfTransfer: {
    type: Date,
    default: Date.now
  },
  amountTransferred: {
    type: Number,
    required: true
  },
  purposeOfTransfer: {
    type: String
  },
  type: {
    type: String,
    enum: ['Debit', 'Credit'],  // track direction of transaction
    required: true
  }
},
{ id: false },
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});



transferSchema.methods.deductBalance = async function () {
  const UserApi = require('./UserData'); // import here to avoid circular deps

  const userAccount = await UserApi.findOne({"usersdetail":this.uniqId});
  if (!userAccount) throw new Error('You do not have access to make transfer on this account');

  if (userAccount.balance < this.amountTransferred) {
    throw new Error('Insufficient balance');
  }

  userAccount.balance = userAccount.balance - this.amountTransferred;
  await userAccount.save();

  return userAccount;
};




transferSchema.methods.creditBalance = async function () {
  const UserApi = require('./UserData'); // import here to avoid circular deps

  const userAccount = await UserApi.findOne({"usersdetail":this.uniqId});
  if (!userAccount) throw new Error('You can not make transfer to this account');

  // if (userAccount.balance < this.amountTransferred) {
  //   throw new Error('Insufficient balance');
  // }

  userAccount.balance = userAccount.balance + this.amountTransferred;
  await userAccount.save();

  return userAccount;
};










const TransferApi = mongoose.model('TransferApi', transferSchema);
module.exports = TransferApi;