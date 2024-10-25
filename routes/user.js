const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Define route to get user data
router.get('/', authMiddleware,userController.getUserData);

module.exports = router;
