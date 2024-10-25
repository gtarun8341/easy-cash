// routes/adminRoutes.js
const express = require('express');
const { changeUserStatus, getAllUsers, getAdminStatistics,getUserDetails } = require('../controllers/adminController');
const router = express.Router();

// Route to change user status (ban/unban)
router.patch('/users/status', changeUserStatus);
router.get('/users', getAllUsers);
router.get('/statistics', getAdminStatistics);
router.get('/users/:id', getUserDetails);

module.exports = router;
