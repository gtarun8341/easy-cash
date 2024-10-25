const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes'); // Import recharge routes
const withdrawalRoutes = require('./routes/withdrawalRoutes'); // Import withdrawal routes
const userTransactionsRoutes = require('./routes/userTransactionsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bankRoutes = require('./routes/bankRoutes');
const userRoutes = require('./routes/user'); // Adjust path as necessary
const bankController = require('./controllers/bankController'); // Import the bank controller
const Bank = require('./models/bankModel');

require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes); // Add the transaction routes
app.use('/api/recharges', rechargeRoutes); // Add the recharge routes
app.use('/api/withdrawals', withdrawalRoutes); // Add the withdrawal routes
app.use('/api/userTransactions', userTransactionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/users', userRoutes);

// Function to create initial banks on server startup
const createInitialBanks = async () => {
    try {
      const banks = ['Bank A', 'Bank B', 'Bank C'];
      
      // Check if banks already exist
      const existingBanks = await Bank.find(); // Fetch existing banks
      
      if (existingBanks.length === 0) {
        const bankData = banks.map(bankName => ({ bankName, accounts: [] }));
        await Bank.insertMany(bankData);
        console.log('Initial banks created', bankData);
      } else {
        console.log('Banks already exist');
      }
    } catch (error) {
      console.error('Error creating initial banks:', error.message);
    }
  };
  
  // Call createInitialBanks after successful DB connection
  connectDB().then(() => {
    createInitialBanks(); // Call to create initial banks
  });
  
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
