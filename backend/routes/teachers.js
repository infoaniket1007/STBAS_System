const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { auth, checkRole } = require('../middleware/auth');

router.use(auth, checkRole(['teacher']));

router.get('/profile', teacherController.getProfile);
router.put('/profile', teacherController.updateProfile);
router.get('/schedule', teacherController.getSchedule);

module.exports = router; 