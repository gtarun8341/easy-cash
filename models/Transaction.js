const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  image1: {
    type: String,
    required: true
  },
  image2: {
    type: String,
    required: true
  },
  createdAt: { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], // Add allowed status values
    default: 'pending', // Default status
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
