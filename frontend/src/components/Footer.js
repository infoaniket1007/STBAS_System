import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>A modern appointment booking system for teachers and students to manage consultations efficiently.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>📧 Email: support@bookingsystem.com</li>
            <li>📞 Phone: +91 9689372539</li>
            <li>📍 Address: 123 Education Street</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer; 