const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth, checkRole } = require('../middleware/auth');

router.use(auth, checkRole(['student']));

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.get('/teachers', studentController.getAvailableTeachers);
router.post('/message', studentController.sendMessage);
router.post('/rate-teacher', studentController.submitRating);

module.exports = router; 