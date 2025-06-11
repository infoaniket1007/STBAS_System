const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');

// Test route to check admin existence
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' });
    res.json({
      adminExists: !!admin,
      adminEmail: admin ? admin.email : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin' });
  }
});

// Create initial admin if not exists
router.post('/create-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.json({ message: 'Admin already exists' });
    }

    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: '$2a$10$YourHashedPasswordHere', // Use bcrypt to hash 'admin123'
      role: 'admin',
      isApproved: true
    });

    await admin.save();
    res.json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router; 