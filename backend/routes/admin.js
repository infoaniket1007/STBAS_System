const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, checkRole } = require('../middleware/auth');

// Protect all admin routes
router.use(auth, checkRole(['admin']));

// Teacher routes
router.get('/teachers', adminController.getAllTeachers);
router.post('/teachers', adminController.addTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Student routes
router.get('/students', adminController.getAllStudents);
router.get('/students/pending', adminController.getPendingStudents);
router.put('/students/:id/approve', adminController.approveStudent);

module.exports = router; 