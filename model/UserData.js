const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apiSchema = new Schema({
  usersdetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  balance: {
    type: Number,
  },

  firstname: {
    type: String,
    required: [true, 'First name is required field!']
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required field!']
  },
  accountNumber: {
    type: Number,
    default: () => Math.floor(1000000000 + Math.random() * 9000000000),
  }

},
{ id: false },
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

apiSchema.virtual('Name').get(function () {
  return this.usersdetail.firstname + ' ' + this.usersdetail.lastname;
});

const UserApi = mongoose.model('UserApi', apiSchema);

module.exports = UserApi;