const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createInitialAdmin } = require('./controllers/authController');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection with options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'booking-system'
}).then(async () => {
  console.log('Connected to MongoDB Successfully');
  // Create initial admin user with await
  try {
    await createInitialAdmin();
    console.log('Admin check/creation completed');
  } catch (error) {
    console.error('Error in admin creation:', error);
  }
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Log MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});