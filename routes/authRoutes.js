// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, updatePassword, updateWithdrawalPassword,  getUserProfile,verifyToken} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.patch('/update-password',authMiddleware, updatePassword); // New route
router.patch('/update-withdrawal-password',authMiddleware, updateWithdrawalPassword); // New route
router.get('/user/profile', authMiddleware, getUserProfile); // New route
router.post('/verify-token', verifyToken);

module.exports = router;
