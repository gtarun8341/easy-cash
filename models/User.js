// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  withdrawalPassword: {
    type: String,
    required: true,
  },
  walletAmount: { // Field to track wallet balance
    type: Number,
    default: 0,
  },
  status: { // New field to track user status (active/banned)
    type: String,
    enum: ['active', 'banned'],
    default: 'active',
  },
  isAdmin: { // Field to identify admin users
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
