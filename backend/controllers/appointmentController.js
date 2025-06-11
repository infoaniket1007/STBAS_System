const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Rating = require('../models/Rating');

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { teacherId, date, time, message } = req.body;
    const studentId = req.user.id;

    const appointment = new Appointment({
      student: studentId,
      teacher: teacherId,
      date,
      time,
      message
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment requested successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// Get teacher's appointments
exports.getTeacherAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ teacher: req.user.id })
      .populate('student', 'name email department rollNumber')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching appointments', 
      error: error.message 
    });
  }
};

// Get student's appointments
exports.getStudentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate('teacher', 'name department subject')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        teacher: req.user.id
      },
      { status },
      { new: true }
    ).populate('student', 'name email');

    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: 'Appointment not found' 
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error updating appointment', 
      error: error.message 
    });
  }
};

// Add this function to handle rating submission
exports.submitRating = async (req, res) => {
  try {
    const { appointmentId, rating, feedback } = req.body;
    const studentId = req.user.id;

    // Find the appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      student: studentId,
      status: 'completed'
    }).populate('teacher');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Completed appointment not found'
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      appointment: appointmentId,
      student: studentId
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this appointment'
      });
    }

    // Create new rating
    const newRating = new Rating({
      appointment: appointmentId,
      student: studentId,
      teacher: appointment.teacher._id,
      rating,
      feedback
    });

    await newRating.save();

    // Update appointment to mark as rated
    appointment.isRated = true;
    await appointment.save();

    // Update teacher's average rating
    const teacher = appointment.teacher;
    const allTeacherRatings = await Rating.find({ teacher: teacher._id });
    const averageRating = allTeacherRatings.reduce((acc, curr) => acc + curr.rating, 0) / allTeacherRatings.length;

    teacher.ratings.push(newRating._id);
    teacher.averageRating = averageRating;
    teacher.totalRatings = allTeacherRatings.length;
    await teacher.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
}; 