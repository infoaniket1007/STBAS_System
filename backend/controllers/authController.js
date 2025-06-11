const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber } = req.body;
    console.log('Registration attempt:', { name, email, role }); // Debug log

    // Input validation
    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          role: !role ? 'Role is required' : null,
          department: !department ? 'Department is required' : null,
          rollNumber: role === 'student' && !rollNumber ? 'Roll number is required' : null
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      rollNumber,
      isApproved: role === 'student' ? false : true // Students need approval
    });

    await user.save();

    // Return success response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: role === 'student' 
        ? 'Registration successful! Please wait for admin approval.'
        : 'Registration successful! You can now login.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt:', { email, role }); // Debug log

    // Input validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password and role'
      });
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });
    console.log('User found:', user ? 'Yes' : 'No'); // Debug log
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or role'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Debug log

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // For non-admin students, check approval
    if (role === 'student' && !user.isApproved && role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Your account is pending approval'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '24h' }
    );

    // Send success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
};

// Create initial admin user
exports.createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Administration',
        isApproved: true
      });

      await admin.save();
      console.log('Admin created successfully with:');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin already exists:', {
        email: adminExists.email,
        role: adminExists.role
      });
    }
  } catch (error) {
    console.error('Error in createInitialAdmin:', error);
    throw error; // Rethrow to handle in caller
  }
}; 