// routes/rechargeRoutes.js
const express = require('express');
const router = express.Router();
const { createRecharge,getPendingRecharges, updateRechargeStatus,getLastSuccessfulBotRecharge } = require('../controllers/rechargeController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST route for creating a recharge
router.post('/', authMiddleware, createRecharge); // Protect the route with auth middleware
// Get all pending recharges
router.get('/pending', getPendingRecharges);

// Update recharge status (Accept/Reject)
router.put('/:id/status', updateRechargeStatus);
router.get('/last-successful-bot', authMiddleware, getLastSuccessfulBotRecharge);

module.exports = router;
