

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Owner = require('../../models/Owner');
//const { BusinessType } = require('../constants/businessType');
const BusinessType = {
  LIBRARY: 'LIBRARY',
  GYM: 'GYM',
  FLAT: 'FLAT'
};
exports.signUp = async (req, res) => {
  try {
    const { email, password, name, businessType } = req.body;

    // Validate business type
    if (!Object.values(BusinessType).includes(businessType.toUpperCase())) {
      return res.status(400).json({ 
        message: `Invalid business type. Must be one of: ${Object.values(BusinessType).join(', ')}` 
      });
    }

    // Check if user already exists with same email AND business type
    const existingUser = await Owner.findOne({ 
      email, 
      businessType: businessType.toUpperCase() 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: `An account with this email already exists for ${businessType} management system` 
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = await Owner.create({
      email,
      password: hashedPassword,
      name,
      businessType: businessType.toUpperCase(),
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newOwner._id, 
        businessType: businessType.toUpperCase(),
        email: newOwner.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newOwner._id,
        email: newOwner.email,
        name: newOwner.name,
        businessType: newOwner.businessType,
      },
    });
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password, businessType } = req.body;

    // Validate required fields
    if (!email || !password || !businessType) {
      return res.status(400).json({
        message: 'Email, password, and business type are required'
      });
    }

    // Find user by email AND business type
    const user = await Owner.findOne({ 
      email,
      businessType: businessType.toUpperCase()
    });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: `No account found with this email for ${businessType} management system`
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        businessType: user.businessType,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response without password
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        businessType: user.businessType,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('SignIn error:', error);
    res.status(500).json({
      message: 'An error occurred during sign in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Add a function to verify token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (excluding password)
    const user = await Owner.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        businessType: user.businessType,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token expired'
      });
    }

    res.status(500).json({
      message: 'An error occurred during token verification'
    });
  }
};

// Optional: Add a refresh token function
exports.refreshToken = async (req, res) => {
  try {
    const { userId, businessType } = req.user; // From auth middleware

    // Generate new token
    const newToken = jwt.sign(
      { userId, businessType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token: newToken
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      message: 'An error occurred during token refresh'
    });
  }
};