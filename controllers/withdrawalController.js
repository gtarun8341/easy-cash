// controllers/withdrawalController.js
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User'); // Import User model
const bcrypt = require('bcryptjs');

const createWithdrawal = async (req, res) => {
  const { withdrawalMethod, upiId, phoneNumber, amount, withdrawalPassword } = req.body;

  if (!withdrawalMethod || !amount || !withdrawalPassword) {
    return res.status(400).json({ message: 'Withdrawal Method, Amount, and Withdrawal Password are required.' });
  }

  try {
    // Get the user's wallet balance
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify withdrawal password
    const isMatch = await bcrypt.compare(withdrawalPassword, user.withdrawalPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid withdrawal password.' });
    }

    // Check if the wallet balance is sufficient
    if (user.walletAmount < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance.' });
    }

    // Create withdrawal data
    const withdrawalData = {
      userId: req.user.id,
      withdrawalMethod,
      amount,
      upiId: withdrawalMethod === 'UPI' ? upiId : undefined,
      phoneNumber: withdrawalMethod === 'PhonePe' ? phoneNumber : undefined,
    };

    // Deduct amount from user's wallet
    user.walletAmount -= amount;
    await user.save(); // Save updated user balance

    // Save the withdrawal request
    const withdrawal = new Withdrawal(withdrawalData);
    await withdrawal.save();

    res.status(201).json(withdrawal);
  } catch (error) {
    console.error('Error creating withdrawal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// controllers/withdrawalController.js
const getWithdrawals = async (req, res) => {
    try {
      const withdrawals = await Withdrawal.find({ status: 'pending' }).populate('userId', 'name phoneNumber');
      res.status(200).json(withdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Update Withdrawal Status
const updateWithdrawalStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionNote } = req.body;

  if (!status || !['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal not found' });
    }

    if (status === 'rejected') {
      await User.findByIdAndUpdate(withdrawal.userId, { $inc: { walletAmount: withdrawal.amount } });
      withdrawal.rejectionNote = rejectionNote; // Save the rejection reason
    }

    withdrawal.status = status;
    await withdrawal.save();

    res.status(200).json(withdrawal);
  } catch (error) {
    console.error('Error updating withdrawal status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


  
module.exports = {
  createWithdrawal,
  updateWithdrawalStatus,
  getWithdrawals
};
