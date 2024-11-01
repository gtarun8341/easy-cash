// models/Withdrawal.js
const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  withdrawalMethod: { type: String, enum: ['UPI', 'PhonePe'], required: true },
  upiId: { type: String, required: false }, // Optional field for UPI ID
  phoneNumber: { type: String, required: false }, // Optional field for PhonePe number
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Set default status to 'pending'
  createdAt: { type: Date, default: Date.now },
  rejectionNote: { type: String }, // Field to store rejection note
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
