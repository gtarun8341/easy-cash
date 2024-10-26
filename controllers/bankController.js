// controllers/bankController.js
const Bank = require('../models/bankModel');

// Create initial banks
exports.createInitialBanks = async (req, res) => {
  try {
    const banks = ['Bank A', 'Bank B', 'Bank C'];
    const existingBanks = await Bank.find({ bankName: { $in: banks } });

    if (existingBanks.length === 0) {
      const bankData = banks.map(bankName => ({ bankName, accounts: [] }));
      await Bank.insertMany(bankData);
      res.status(201).json({ message: 'Initial banks created', bankData });
    } else {
      res.status(400).json({ message: 'Banks already exist' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add account to a bank
exports.addAccountToBank = async (req, res) => {
  try {
    console.log(req.body,req.params)
    const { bankName } = req.params;
    const { accountNumber, ifscCode } = req.body;

    const bank = await Bank.findOne({ _id: bankName });

    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    bank.accounts.push({ accountNumber, ifscCode });
    await bank.save();

    res.status(200).json({ message: 'Account added', bank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all banks and accounts
exports.getAllBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get accounts of a specific bank
exports.getBankAccounts = async (req, res) => {
  try {
    const { bankName } = req.params;

    const bank = await Bank.findOne({ bankName });
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAccountFromBank = async (req, res) => {
  try {
    const { bankName, accountId } = req.params;

    const bank = await Bank.findOne({ _id: bankName });
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    bank.accounts = bank.accounts.filter(account => account._id.toString() !== accountId);
    await bank.save();

    res.status(200).json({ message: 'Account deleted', bank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};