const User = require('../models/User'); // Adjust the path as necessary
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Recharge = require('../models/Recharge');
const mongoose = require('mongoose');

// Controller function to get user data
exports.getUserData = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in req.user
  console.log(userId);
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId); // Use 'new' here

    // Fetch total accepted deposits
    const totalDeposits = await Transaction.aggregate([
      { $match: { user: userObjectId, status: 'accepted' } }, // Filter by accepted status
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Fetch total accepted withdrawals
    const totalWithdrawals = await Withdrawal.aggregate([
      { $match: { userId: userObjectId, status: 'accepted' } }, // Filter by accepted status
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Fetch today's accepted deposits
    const todayDeposits = await Transaction.aggregate([
      { $match: { user: userObjectId, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, status: 'accepted' } }, // Filter by accepted status
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Fetch today's accepted withdrawals
    const todayWithdrawals = await Withdrawal.aggregate([
      { $match: { userId: userObjectId, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, status: 'accepted' } }, // Filter by accepted status
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Fetch total accepted recharge
    const totalRecharge = await Recharge.aggregate([
      { $match: { userId: userObjectId, status: 'accepted' } }, // Filter by accepted status
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Fetch wallet balance from User model
    const user = await User.findById(userId);
    const walletBalance = user ? user.walletAmount : 0;

    // Fetch recent accepted transactions
// Fetch recent accepted transactions
const recentTransactions = await Promise.all([
    Transaction.find({ user: userObjectId, status: 'accepted' })
      .select('amount createdAt') // Select the fields without renaming
      .sort({ createdAt: -1 })
      .limit(5),
    Withdrawal.find({ userId: userObjectId, status: 'accepted' })
      .select('amount createdAt') // Select the fields without renaming
      .sort({ createdAt: -1 })
      .limit(5),
    Recharge.find({ userId: userObjectId, status: 'accepted' })
      .select('amount createdAt') // Select the fields without renaming
      .sort({ createdAt: -1 })
      .limit(5)
  ]);
  
  // Combine all transactions into a single array
  const combinedTransactions = [
    ...recentTransactions[0].map(trans => ({ ...trans._doc, type: 'Deposit' })),
    ...recentTransactions[1].map(withdrawal => ({ ...withdrawal._doc, type: 'Withdrawal' })),
    ...recentTransactions[2].map(recharge => ({ ...recharge._doc, type: 'Recharge' }))
  ];
  
  // Sort combined transactions by date
  const sortedTransactions = combinedTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Use createdAt here
  
  // Limit to the latest 5 transactions
  const latestTransactions = sortedTransactions.slice(0, 5);
  
  // Construct response data
  const response = {
    walletBalance: walletBalance,
    totalDeposit: totalDeposits[0]?.total || 0,
    totalWithdrawal: totalWithdrawals[0]?.total || 0,
    todayDeposit: todayDeposits[0]?.total || 0,
    todayWithdrawal: todayWithdrawals[0]?.total || 0,
    totalRecharge: totalRecharge[0]?.total || 0,
    recentTransactions: latestTransactions.map(trans => ({
      id: trans._id,
      type: trans.type,
      amount: trans.amount,
      date: trans.createdAt ? trans.createdAt.toISOString().split('T')[0] : null // Format date as needed
    }))
  };
  

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
