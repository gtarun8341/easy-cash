const mongoose = require('mongoose');

const RechargeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  botUserId: { type: String, required: false },
  type: { type: String, enum: ['Bot Recharge', 'Mobile Recharge'], required: true },
  operator: { type: String, enum: ['Airtel', 'Jio', 'Vi'], required: false },
  number: { type: String, required: false },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // Add status field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recharge', RechargeSchema);
