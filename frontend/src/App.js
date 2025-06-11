import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherManagement from './pages/admin/TeacherManagement';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teachers" element={<TeacherManagement />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 