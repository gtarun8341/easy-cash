const Transaction = require('../models/Transaction');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save in uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Handle transaction upload
const uploadTransaction = async (req, res) => {
    const { amount } = req.body;
  
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', JSON.stringify(req.files, null, 2));
  
    // Validate amount
    if (!amount || isNaN(amount)) {
      console.log('Invalid amount:', amount);
      return res.status(400).json({ message: 'Invalid amount' });
    }
  
    if (!req.files || !req.files.image1 || !req.files.image2) {
      console.log('Missing images in the upload request');
      return res.status(400).json({ message: 'Please upload both images' });
    }
  
    try {
      const newTransaction = new Transaction({
        user: req.user.id,
        amount,
        image1: req.files.image1[0].filename,
        image2: req.files.image2[0].filename,
        status: 'pending', // Set status to pending
      });
  
      await newTransaction.save();
      console.log('Transaction saved:', newTransaction);
      res.status(201).json({ message: 'Transaction submitted successfully', transaction: newTransaction });
    } catch (error) {
      console.error('Error saving transaction:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

  // Fetch pending transactions
const getPendingTransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find({ status: 'pending' }).populate('user', 'name email');
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      res.status(500).json({ message: 'Error fetching pending transactions' });
    }
  };
  
// In your transaction controller
const acceptTransaction = async (req, res) => {
    const { id } = req.params;
    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Update the user's wallet amount
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { walletAmount: transaction.amount } // Increment wallet amount
      });
  
      // Update the transaction status to accepted
      transaction.status = 'accepted';
      await transaction.save();
  
      res.status(200).json({ message: 'Transaction accepted', transaction });
    } catch (error) {
      console.error('Error accepting transaction:', error);
      res.status(500).json({ message: 'Error accepting transaction' });
    }
  };
  
  
  // Reject a transaction
// Reject Transaction
const rejectTransaction = async (req, res) => {
  const { id } = req.params;
  const { rejectionNote } = req.body;

  try {
    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status: 'rejected', rejectionNote },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction rejected', transaction });
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    res.status(500).json({ message: 'Error rejecting transaction' });
  }
};

  
  module.exports = {
    uploadTransaction,
    getPendingTransactions,
    acceptTransaction,
    rejectTransaction,
    upload, // Export multer upload middleware
  };