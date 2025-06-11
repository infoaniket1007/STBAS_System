const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Rating = require('../models/Rating');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, department, rollNumber } = req.body;
    const student = await User.findByIdAndUpdate(
      req.user.id,
      { name, department, rollNumber },
      { new: true }
    ).select('-password');

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get available teachers
exports.getAvailableTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: 'teacher',
      isApproved: true
    }).select('name department subject');

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// Send message to teacher
exports.sendMessage = async (req, res) => {
  try {
    const { teacherId, message } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      {
        student: req.user.id,
        teacher: teacherId,
        status: 'approved'
      },
      { $push: { messages: { sender: req.user.id, content: message } } },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'No active appointment found with this teacher' });
    }

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Submit teacher rating
exports.submitRating = async (req, res) => {
  try {
    const { appointmentId, teacherId, rating, feedback } = req.body;
    
    // Verify appointment exists and is completed
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      student: req.user.id,
      teacher: teacherId,
      status: 'completed'
    });

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'No completed appointment found' 
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      appointment: appointmentId,
      student: req.user.id,
      teacher: teacherId
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this appointment'
      });
    }

    // Create new rating
    const newRating = new Rating({
      student: req.user.id,
      teacher: teacherId,
      appointment: appointmentId,
      rating,
      feedback
    });

    await newRating.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
}; 