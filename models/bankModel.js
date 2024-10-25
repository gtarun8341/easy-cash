// models/bankModel.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true }
});

const bankSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  accounts: [accountSchema] // Array of accounts within each bank
});

module.exports = mongoose.model('Bank', bankSchema);
