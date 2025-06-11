import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    pendingStudents: 0
  });
  const [pendingStudents, setPendingStudents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
    fetchPendingStudents();
  }, []);

  const fetchStats = async () => {
    try {
      const [teachers, students, pending] = await Promise.all([
        api.get('/admin/teachers'),
        api.get('/admin/students'),
        api.get('/admin/students/pending')
      ]);

      setStats({
        totalTeachers: teachers.data.length,
        totalStudents: students.data.length,
        pendingStudents: pending.data.length
      });
    } catch (error) {
      setError('Error fetching statistics');
      console.error('Error:', error);
    }
  };

  const fetchPendingStudents = async () => {
    try {
      const response = await api.get('/admin/students/pending');
      setPendingStudents(response.data);
    } catch (error) {
      setError('Error fetching pending students');
      console.error('Error:', error);
    }
  };

  const handleApproveStudent = async (studentId) => {
    try {
      await api.put(`/admin/students/${studentId}/approve`);
      setSuccess('Student approved successfully');
      fetchStats();
      fetchPendingStudents();
    } catch (error) {
      setError('Error approving student');
      console.error('Error:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Teachers</h3>
          <p>{stats.totalTeachers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <p>{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p>{stats.pendingStudents}</p>
        </div>
      </div>

      <div className="pending-students">
        <h3>Pending Student Approvals</h3>
        {pendingStudents.length === 0 ? (
          <p>No pending approvals</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Roll Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department}</td>
                  <td>{student.rollNumber}</td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => handleApproveStudent(student._id)}
                    >
                      Approve
                    </button>
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

export default AdminDashboard; 