import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Teacher-Student Appointment System</h1>
          <p>Schedule and manage your academic consultations efficiently</p>
          <div className="hero-buttons">
            <Link to="/register">
              <button className="cta-button primary">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="cta-button secondary">Login</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Our Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Scheduling</h3>
            <p>Book appointments with your teachers hassle-free</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Real-time Updates</h3>
            <p>Get instant notifications about your appointments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Direct Communication</h3>
            <p>Chat directly with teachers about your queries</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Track Progress</h3>
            <p>Monitor your consultation history and outcomes</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Register Account</h3>
            <p>Create your account as a student or teacher</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Book Appointment</h3>
            <p>Choose your preferred time slot</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Confirmation</h3>
            <p>Receive instant appointment confirmation</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Meet Teacher</h3>
            <p>Attend your consultation at scheduled time</p>
          </div>
        </div>
      </section>

      {/* <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join our platform and make appointment scheduling easier than ever</p>
          <Link to="/register">
            <button className="cta-button primary">Register Now</button>
          </Link>
        </div>
      </section> */}
    </div>
  );
}

export default Home; 