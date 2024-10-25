const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Recharge = require('../models/Recharge');
const mongoose = require('mongoose'); // Ensure mongoose is imported

// Function to change user status (ban/unban)
const changeUserStatus = async (req, res) => {
  const { userId, status } = req.body; // Status should be either 'active' or 'banned'
console.log(req.body)
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: `User status changed to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
// Function to get admin statistics
const getAdminStatistics = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Calculate total deposits (only accepted)
    const totalDeposit = await Transaction.aggregate([
      { $match: { status: 'accepted' } }, // Filter for accepted transactions
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalDepositAmount = totalDeposit.length ? totalDeposit[0].total : 0;

    // Calculate total withdrawals (only accepted)
    const totalWithdrawal = await Withdrawal.aggregate([
      { $match: { status: 'accepted' } }, // Filter for accepted withdrawals
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalWithdrawalAmount = totalWithdrawal.length ? totalWithdrawal[0].total : 0;

    // Calculate total recharges (only accepted)
    const totalRecharge = await Recharge.aggregate([
      { $match: { status: 'accepted' } }, // Filter for accepted recharges
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRechargeAmount = totalRecharge.length ? totalRecharge[0].total : 0;

    // Calculate today's deposits (only accepted)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDeposit = await Transaction.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'accepted' } }, // Filter for today's accepted transactions
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const todayDepositAmount = todayDeposit.length ? todayDeposit[0].total : 0;

    // Calculate today's withdrawals (only accepted)
    const todayWithdrawal = await Withdrawal.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'accepted' } }, // Filter for today's accepted withdrawals
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const todayWithdrawalAmount = todayWithdrawal.length ? todayWithdrawal[0].total : 0;

    // Send response
    res.status(200).json({
      totalUsers,
      totalDeposit: totalDepositAmount,
      totalWithdrawal: totalWithdrawalAmount,
      totalRecharge: totalRechargeAmount,
      todayDeposit: todayDepositAmount,
      todayWithdrawal: todayWithdrawalAmount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from request parameters
    console.log("User ID being queried:", userId);
    const userObjectId = new mongoose.Types.ObjectId(userId); // Use 'new' here

    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("No user found with the given ID.");
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("User found:", user);

    // Calculate total deposits for the user with 'accepted' status
    const totalDeposit = await Transaction.aggregate([
      { $match: { user: userObjectId, status: 'accepted' } }, // Match transactions for this user with accepted status
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Log total deposits
    console.log("Total Deposit Data:", totalDeposit);
    const totalDepositAmount = totalDeposit.length ? totalDeposit[0].total : 0;
    console.log("Total Deposit Amount:", totalDepositAmount);

    // Calculate total withdrawals for the user with 'accepted' status
    const totalWithdrawal = await Withdrawal.aggregate([
      { $match: { userId: userObjectId, status: 'accepted' } }, // Match withdrawals for this user with accepted status
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Log total withdrawals
    console.log("Total Withdrawal Data:", totalWithdrawal);
    const totalWithdrawalAmount = totalWithdrawal.length ? totalWithdrawal[0].total : 0;
    console.log("Total Withdrawal Amount:", totalWithdrawalAmount);

    // Calculate total recharges for the user with 'accepted' status
    const totalRecharge = await Recharge.aggregate([
      { $match: { userId: userObjectId, status: 'accepted' } }, // Match recharges for this user with accepted status
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Log total recharges
    console.log("Total Recharge Data:", totalRecharge);
    const totalRechargeAmount = totalRecharge.length ? totalRecharge[0].total : 0;
    console.log("Total Recharge Amount:", totalRechargeAmount);

    // Send response
    return res.json({
      name: user.name,
      totalWithdrawal: totalWithdrawalAmount,
      totalDeposit: totalDepositAmount,
      totalRecharge: totalRechargeAmount,
      status: user.status,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { changeUserStatus, getAllUsers ,getAdminStatistics,getUserDetails};