const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { auth, checkRole } = require('../middleware/auth');

router.use(auth);

// Student routes
router.post('/', checkRole(['student']), appointmentController.createAppointment);
router.get('/student', checkRole(['student']), appointmentController.getStudentAppointments);

// Teacher routes
router.get('/teacher', checkRole(['teacher']), appointmentController.getTeacherAppointments);
router.put('/:id/status', checkRole(['teacher']), appointmentController.updateAppointmentStatus);

// Add this route for rating submission
router.post('/:id/rate', checkRole(['student']), appointmentController.submitRating);

module.exports = router; 