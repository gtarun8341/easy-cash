// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, number, password, withdrawalPassword } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ number });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({
      name,
      number,
      password: await bcrypt.hash(password, 10),
      withdrawalPassword: await bcrypt.hash(withdrawalPassword, 10),
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, number: user.number } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// controllers/authController.js

const loginUser = async (req, res) => {
  const { number, password } = req.body;

  try {
    const user = await User.findOne({ number });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'User is banned' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, number: user.number, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};


const updatePassword = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id; // Assuming you're using middleware to set req.user from JWT

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const updateWithdrawalPassword = async (req, res) => {
  const { withdrawalPassword } = req.body;
  const userId = req.user.id; // Assuming you're using middleware to set req.user from JWT

  try {
    const hashedWithdrawalPassword = await bcrypt.hash(withdrawalPassword, 10);
    await User.findByIdAndUpdate(userId, { withdrawalPassword: hashedWithdrawalPassword });
    res.status(200).json({ message: 'Withdrawal password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -withdrawalPassword'); // Exclude sensitive info
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, phoneNumber: user.number });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const verifyToken = (req, res) => {
  const { token } = req.body;

  console.log('Starting token verification...');
  console.log('Received token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);

    // Send back both isValid and isAdmin status
    res.json({ isValid: true, isAdmin: decoded.isAdmin });
  } catch (error) {
    console.error('Token verification failed:', error.message);
    console.error('Error stack:', error.stack);
    res.json({ isValid: false });
  }
};

module.exports = { registerUser, loginUser, updatePassword, updateWithdrawalPassword,getUserProfile,verifyToken };

