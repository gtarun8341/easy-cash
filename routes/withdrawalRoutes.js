// routes/withdrawalRoutes.js
const express = require('express');
const { createWithdrawal, updateWithdrawalStatus,getWithdrawals } = require('../controllers/withdrawalController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createWithdrawal); // Route for creating withdrawal
router.patch('/:id/status', updateWithdrawalStatus); // Route for updating withdrawal status
router.get('/', getWithdrawals); // Route to get pending withdrawals

module.exports = router;
