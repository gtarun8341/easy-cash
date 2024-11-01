// controllers/rechargeController.js
const Recharge = require('../models/Recharge');
const User = require('../models/User'); // Make sure to import the User model

const createRecharge = async (req, res) => {
  const { type, operator, number, amount, botUserId } = req.body;

  if (!type || !amount) {
    return res.status(400).json({ message: 'Type and Amount are required.' });
  }

  try {
    // Fetch the user by ID (from the token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the wallet balance is sufficient
    if (user.walletAmount < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Create the recharge data
    const rechargeData = {
      userId: req.user.id,
      type,
      operator: type === 'Mobile Recharge' ? operator : undefined,
      number: type === 'Mobile Recharge' ? number : undefined,
      amount,
      botUserId: type === 'Bot Recharge' ? botUserId : undefined,
      status: 'pending',
    };

    const recharge = new Recharge(rechargeData);

    // Save the recharge and deduct amount from user's wallet
    await recharge.save();
    user.walletAmount -= amount;
    await user.save();

    res.status(201).json(recharge);
  } catch (error) {
    console.error('Error creating recharge:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingRecharges = async (req, res) => {
    try {
      const recharges = await Recharge.find({ status: 'pending' }).populate('userId', 'name');
      res.json(recharges);
    } catch (error) {
      console.error('Error fetching recharges:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Update recharge status (Accept/Reject)
// Update Recharge Status
const updateRechargeStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionNote } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const recharge = await Recharge.findById(id).populate('userId');
    if (!recharge) {
      return res.status(404).json({ message: 'Recharge not found' });
    }

    const user = await User.findById(recharge.userId._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (status === 'accepted') {
      if (user.walletAmount < recharge.amount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      user.walletAmount -= recharge.amount;
      await user.save();
    }

    recharge.status = status;
    if (status === 'rejected') recharge.rejectionNote = rejectionNote;
    await recharge.save();

    res.json(recharge);
  } catch (error) {
    console.error('Error updating recharge status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

  
  const getLastSuccessfulBotRecharge = async (req, res) => {
    try {
      const lastRecharge = await Recharge.findOne({
        userId: req.user.id,
        type: 'Bot Recharge',
        status: 'accepted' // Considered as successful
      }).sort({ createdAt: -1 }); // Sort by latest
  
      res.json(lastRecharge || {});
    } catch (error) {
      console.error('Error fetching last bot recharge:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports = { createRecharge, getPendingRecharges, updateRechargeStatus, getLastSuccessfulBotRecharge };
  
