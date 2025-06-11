import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For admin login, first verify the credentials
      if (formData.role === 'admin') {
        if (formData.email !== 'admin@example.com') {
          setError('Invalid admin email');
          setLoading(false);
          return;
        }
      }

      console.log('Attempting login with:', {
        email: formData.email,
        role: formData.role
      });

      const response = await api.post('/auth/login', formData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect based on role
        switch (response.data.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data
      });
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
          <div className="form-group role-selection">
  <label>
    <input
      type="radio"
      name="role"
      value="student"
      checked={formData.role === 'student'}
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
    /> 
    Student
  </label>
  <label>
    <input
      type="radio"
      name="role"
      value="teacher"
      checked={formData.role === 'teacher'}
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
    />
    Teacher
  </label>
  <label>
    <input
      type="radio"
      name="role"
      value="admin"
      checked={formData.role === 'admin'}
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
    />
    Admin
  </label>
</div>

          {/* <div className="form-group">
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}
          <button 
            type="submit" 
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Add admin credentials hint */}
        {formData.role === 'admin' && (
          <div className="admin-hint">
            <p>Default admin credentials:</p>
            <p>Email: admin@example.com</p>
            <p>Password: admin123</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login; 