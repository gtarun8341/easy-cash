const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadTransaction, upload,getPendingTransactions,acceptTransaction,rejectTransaction } = require('../controllers/transactionController');

// Route for uploading transaction with two images
router.post('/upload', authMiddleware, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), uploadTransaction);
// Route to fetch all pending transactions
router.get('/pending', getPendingTransactions);

// Route to accept a transaction
router.patch('/accept/:id', acceptTransaction);

// Route to reject a transaction
router.patch('/reject/:id', rejectTransaction);

module.exports = router;
