import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teacherProfile, setTeacherProfile] = useState({
    name: '',
    department: '',
    subject: '',
    averageRating: 0,
    totalRatings: 0
  });

  useEffect(() => {
    fetchAppointments();
    fetchTeacherProfile();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/teacher');
      setAppointments(response.data);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error:', error);
    }
  };

  const fetchTeacherProfile = async () => {
    try {
      const response = await api.get('/teachers/profile');
      setTeacherProfile(response.data);
    } catch (error) {
      setError('Failed to fetch profile');
      console.error('Error:', error);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setSuccess(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      setError('Failed to update appointment status');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="teacher-dashboard">
      <h2>Teacher Dashboard</h2>

      <div className="profile-section">
        <h3>My Profile</h3>
        <div className="rating-info">
          <p>
            <strong>Name:</strong> {teacherProfile.name}
          </p>
          <p>
            <strong>Department:</strong> {teacherProfile.department}
          </p>
          <p>
            <strong>Subject:</strong> {teacherProfile.subject}
          </p>
          <p>
            <strong>Average Rating:</strong>{' '}
            {teacherProfile.averageRating ? (
              <span className="rating">
                {teacherProfile.averageRating.toFixed(1)} / 5
                <span className="rating-count">
                  ({teacherProfile.totalRatings} ratings)
                </span>
              </span>
            ) : (
              'No ratings yet'
            )}
          </p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="appointments-section">
        <h3>Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.student.name}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.message || 'No message'}</td>
                  <td>
                    <span className={`status-${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    {appointment.status === 'pending' && (
                      <div className="action-buttons">
                        <button
                          className="approve-btn"
                          onClick={() => handleStatusUpdate(appointment._id, 'approved')}
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {appointment.status === 'approved' && (
                      <button
                        className="complete-btn"
                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                        disabled={loading}
                      >
                        Mark Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard; 