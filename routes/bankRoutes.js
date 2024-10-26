// routes/bankRoutes.js
const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');

// Create initial banks
router.post('/banks/init', bankController.createInitialBanks);

// Add account to a specific bank
router.post('/banks/:bankName/accounts', bankController.addAccountToBank);

// Get all banks
router.get('/banks', bankController.getAllBanks);

// Get accounts of a specific bank
router.get('/banks/:bankName', bankController.getBankAccounts);

router.delete('/banks/:bankName/accounts/:accountId', bankController.deleteAccountFromBank);

module.exports = router;
