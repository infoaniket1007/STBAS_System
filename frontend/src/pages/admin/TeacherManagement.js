import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './TeacherManagement.css';

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    subject: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/admin/teachers');
      setTeachers(response.data);
    } catch (error) {
      setError('Failed to fetch teachers');
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log('Adding teacher:', formData); // Debug log
      const response = await api.post('/admin/teachers', formData);
      console.log('Response:', response.data); // Debug log

      setSuccess('Teacher added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        department: '',
        subject: ''
      });
      fetchTeachers(); // Refresh the teachers list
    } catch (error) {
      console.error('Error adding teacher:', error);
      setError(error.response?.data?.message || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/admin/teachers/${teacherId}`);
        setSuccess('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        setError('Failed to delete teacher');
      }
    }
  };

  return (
    <div className="teacher-management">
      <h2>Teacher Management</h2>
      
      <div className="add-teacher-form">
        <h3>Add New Teacher</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Teacher'}
          </button>
        </form>
      </div>

      <div className="teachers-list">
        <h3>Teachers List</h3>
        {teachers.length === 0 ? (
          <p>No teachers found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.subject}</td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(teacher._id)}
                    >
                      Delete
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

export default TeacherManagement; 