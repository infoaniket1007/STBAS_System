import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import RatingModal from '../../components/RatingModal';
import api from '../../utils/api';

function StudentDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    teacherId: '',
    date: '',
    time: '',
    message: ''
  });

  // Fetch teachers and appointments on component mount
  useEffect(() => {
    fetchTeachers();
    fetchAppointments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/students/teachers');
      setTeachers(response.data);
    } catch (error) {
      setError('Failed to fetch teachers');
      console.error('Error:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/student');
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      setFormData({
        teacherId: '',
        date: '',
        time: '',
        message: ''
      });
      fetchAppointments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Rating functionality
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleRatingSubmit = async (ratingData) => {
    try {
      await api.post(`/appointments/${ratingData.appointmentId}/rate`, {
        rating: ratingData.rating,
        feedback: ratingData.feedback
      });
      fetchAppointments();
      setShowRatingModal(false);
      setSuccess('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  };

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>
      
      <div className="book-appointment">
        <h3>Book Appointment</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} - {teacher.department} ({teacher.subject})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Message (optional)"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>

      <div className="my-appointments">
        <h3>My Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.teacher.name}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <span className={`status-${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    {appointment.status === 'completed' && !appointment.isRated && (
                      <button
                        className="rate-btn"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowRatingModal(true);
                        }}
                      >
                        Rate Teacher
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showRatingModal && (
        <RatingModal
          appointment={selectedAppointment}
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}

export default StudentDashboard; 