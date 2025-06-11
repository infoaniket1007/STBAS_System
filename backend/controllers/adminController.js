const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Add new teacher
exports.addTeacher = async (req, res) => {
  try {
    const { name, email, password, department, subject } = req.body;

    // Validate required fields
    if (!name || !email || !password || !department || !subject) {
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          department: !department ? 'Department is required' : null,
          subject: !subject ? 'Subject is required' : null
        }
      });
    }

    // Check if teacher already exists
    const existingTeacher = await User.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new teacher
    const teacher = new User({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      department,
      subject,
      isApproved: true
    });

    await teacher.save();
    
    // Return success without password
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'Teacher added successfully',
      teacher: teacherResponse
    });
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding teacher', 
      error: error.message 
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'teacher'
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ 
      success: true,
      message: 'Teacher deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting teacher', 
      error: error.message 
    });
  }
};

// Approve student
exports.approveStudent = async (req, res) => {
  try {
    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'student' },
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ 
      success: true,
      message: 'Student approved successfully',
      student
    });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error approving student', 
      error: error.message 
    });
  }
};

// Get pending students
exports.getPendingStudents = async (req, res) => {
  try {
    const students = await User.find({ 
      role: 'student',
      isApproved: false 
    })
    .select('-password')
    .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    console.error('Error fetching pending students:', error);
    res.status(500).json({ 
      message: 'Error fetching pending students', 
      error: error.message 
    });
  }
}; 