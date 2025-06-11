const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Get teacher profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id)
      .select('-password')
      .populate('ratings');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        subject: teacher.subject,
        averageRating: teacher.averageRating || 0,
        totalRatings: teacher.totalRatings || 0,
        ratings: teacher.ratings
      }
    });
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update teacher profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, subject } = req.body;
    const teacher = await User.findByIdAndUpdate(
      req.user.id,
      { name, department, subject },
      { new: true }
    ).select('-password');

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get teacher's schedule
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Appointment.find({
      teacher: req.user.id,
      status: 'approved',
      date: { $gte: new Date() }
    }).populate('student', 'name email');

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
}; 