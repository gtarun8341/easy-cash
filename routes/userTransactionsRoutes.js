// routes/userTransactionsRoutes.js
const express = require('express');
const { getUserTransactions } = require('../controllers/userTransactionsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get all transactions for the authenticated user
router.get('/user/transactions', authMiddleware, getUserTransactions);

module.exports = router;
