import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserName(user.name);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h1>Booking System</h1>
        </div>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          
          {!isLoggedIn ? (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                Register
              </Link>
            </>
          ) : (
            <>
              {userRole === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className={`nav-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                    Dashboard
                  </Link>
                  <Link to="/admin/teachers" className={`nav-link ${location.pathname === '/admin/teachers' ? 'active' : ''}`}>
                    Manage Teachers
                  </Link>
                </>
              )}
              {userRole === 'teacher' && (
                <Link to="/teacher/dashboard" className={`nav-link ${location.pathname === '/teacher/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
              )}
              {userRole === 'student' && (
                <Link to="/student/dashboard" className={`nav-link ${location.pathname === '/student/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
              )}
              <span className="nav-user">Welcome, {userName}</span>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 