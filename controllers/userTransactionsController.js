// controllers/userTransactionsController.js
const Transaction = require('../models/Transaction');
const Recharge = require('../models/Recharge');
const Withdrawal = require('../models/Withdrawal');

// Get all transactions for a specific user
const getUserTransactions = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the authenticated user

  try {
    const transactions = await Transaction.find({ user: userId })
      .populate('user', 'name email') // Populate user info if needed
      .sort({ createdAt: -1 }); // Sort by creation date, latest first

    const recharges = await Recharge.find({ userId });
    const withdrawals = await Withdrawal.find({ userId });

    // Combine transactions, recharges, and withdrawals
    const allTransactions = [
      ...transactions.map(t => ({ ...t.toObject(), type: 'Transaction' })),
      ...recharges.map(r => ({ ...r.toObject(), type: 'Recharge' })),
      ...withdrawals.map(w => ({ ...w.toObject(), type: 'Withdrawal' })),
    ];

    return res.status(200).json({ transactions: allTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserTransactions };
