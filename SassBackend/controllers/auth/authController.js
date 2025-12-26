const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Owner = require('../../models/Owner');
const { sendPasswordResetEmail } = require('../../utils/emailService');
const { canAddBusinessType, getAvailableBusinessTypes } = require('../../utils/businessTypeAccess');

const BusinessType = {
  LIBRARY: 'LIBRARY',
  GYM: 'GYM'
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

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedBusinessType = businessType.toUpperCase();

    // Check if user already exists (by email only - one account per email)
    const existingUser = await Owner.findOne({ email: normalizedEmail });

    if (existingUser) {
      // User exists - check if they can add this business type
      const userBusinessTypes = existingUser.businessTypes && existingUser.businessTypes.length > 0 
        ? existingUser.businessTypes 
        : (existingUser.businessType ? [existingUser.businessType] : []);

      // Check if they already have this business type
      if (userBusinessTypes.includes(normalizedBusinessType)) {
        // User already has access - just sign them in
        const token = jwt.sign(
          { 
            userId: existingUser._id, 
            businessType: normalizedBusinessType,
            email: existingUser.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Update current business type
        existingUser.currentBusinessType = normalizedBusinessType;
        await existingUser.save();

        return res.status(200).json({
          message: 'Signed in successfully',
          token,
          user: {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
            businessType: normalizedBusinessType,
            allBusinessTypes: existingUser.businessTypes || [existingUser.businessType],
            membershipType: existingUser.membershipType,
            trialStatus: existingUser.trialStatus,
          },
        });
      }

      // Check if they can add this business type
      const canAdd = canAddBusinessType(
        userBusinessTypes, 
        normalizedBusinessType, 
        existingUser.membershipType || 'None'
      );

      if (!canAdd.allowed) {
        return res.status(403).json({
          message: canAdd.message,
          upgradeRequired: true
        });
      }

      // Add business type to user's account
      if (!existingUser.businessTypes || existingUser.businessTypes.length === 0) {
        existingUser.businessTypes = userBusinessTypes;
      }
      if (!existingUser.businessTypes.includes(normalizedBusinessType)) {
        existingUser.businessTypes.push(normalizedBusinessType);
      }
      existingUser.currentBusinessType = normalizedBusinessType;
      await existingUser.save();

      const token = jwt.sign(
        { 
          userId: existingUser._id, 
          businessType: normalizedBusinessType,
          email: existingUser.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Business type added successfully',
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          businessType: normalizedBusinessType,
          allBusinessTypes: existingUser.businessTypes,
          membershipType: existingUser.membershipType,
          trialStatus: existingUser.trialStatus,
        },
      });
    }

    // New user - create account
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = await Owner.create({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      businessType: normalizedBusinessType,
      businessTypes: [normalizedBusinessType],
      currentBusinessType: normalizedBusinessType,
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newOwner._id, 
        businessType: normalizedBusinessType,
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
        businessType: normalizedBusinessType,
        allBusinessTypes: [normalizedBusinessType],
        membershipType: newOwner.membershipType,
        trialStatus: newOwner.trialStatus,
      },
    });
  } catch (error) {
    console.error('SignUp error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.signIn = async (req, res) => {
  try {
    const { email, password, businessType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email only (one account per email)
    let user = await Owner.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: `No account found with this email`
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Get user's available business types
    const userBusinessTypes = user.businessTypes && user.businessTypes.length > 0 
      ? user.businessTypes 
      : (user.businessType ? [user.businessType] : []);

    // If businessType is provided, validate access
    let requestedBusinessType = null;
    if (businessType) {
      const normalizedRequestedType = businessType.toUpperCase();
      
      // Check if user has access to this business type
      const { checkBusinessTypeAccess } = require('../../utils/businessTypeAccess');
      const accessCheck = checkBusinessTypeAccess(
        userBusinessTypes, 
        normalizedRequestedType, 
        user.membershipType || 'None'
      );

      if (!accessCheck.allowed) {
        // Display name for membership type (treat "None" as "Starter")
        const displayMembershipType = user.membershipType === "None" || !user.membershipType ? "Starter" : user.membershipType;
        
        return res.status(403).json({
          message: accessCheck.message,
          availableBusinessTypes: userBusinessTypes,
          currentBusinessType: user.currentBusinessType || userBusinessTypes[0] || user.businessType,
          membershipType: displayMembershipType,
          upgradeRequired: true
        });
      }

      requestedBusinessType = normalizedRequestedType;
    } else {
      // No business type specified - use current or first available
      requestedBusinessType = user.currentBusinessType || userBusinessTypes[0] || user.businessType;
    }

    // Update current business type
    if (requestedBusinessType && requestedBusinessType !== user.currentBusinessType) {
      user.currentBusinessType = requestedBusinessType;
    }

    // Initialize trial if first login
    if (!user.trialStartDate) {
      user.trialStartDate = new Date();
      user.trialStatus = "TRIAL";
    }

    // Check if trial has expired (7-day trial period)
    const trialEndDate = new Date(user.trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    if (new Date() > trialEndDate && user.trialStatus === "TRIAL") {
      user.trialStatus = "EXPIRED"; // Update status in DB
    }

    await user.save(); // Save updates to DB

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        businessType: requestedBusinessType, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        businessType: requestedBusinessType,
        allBusinessTypes: userBusinessTypes,
        currentBusinessType: requestedBusinessType,
        trialStatus: user.trialStatus,  // Trial info stored in DB
        trialStartDate: user.trialStartDate,
        membershipType: user.membershipType, 
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error("SignIn error:", error);
    res.status(500).json({ message: "Error during sign in" });
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

// Forgot password - send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email, businessType } = req.body;

    if (!email || !businessType) {
      return res.status(400).json({ 
        message: 'Email and business type are required' 
      });
    }

    // Validate business type
    if (!Object.values(BusinessType).includes(businessType.toUpperCase())) {
      return res.status(400).json({ 
        message: `Invalid business type. Must be one of: ${Object.values(BusinessType).join(', ')}` 
      });
    }

    // Find user by email and business type
    const user = await Owner.findOne({ 
      email: email.toLowerCase().trim(),
      businessType: businessType.toUpperCase()
    });

    // Always return success message for security (don't reveal if user exists)
    if (!user) {
      return res.status(200).json({
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token and expiry (1 hour from now)
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.businessType);
      res.status(200).json({
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
      // Clear the reset token if email fails
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      // Provide more specific error message
      let errorMessage = 'Error sending password reset email. Please try again later.';
      if (emailError.message && emailError.message.includes('Email service is not configured')) {
        errorMessage = 'Email service is not configured. Please contact support.';
      } else if (emailError.message && emailError.message.includes('authentication failed')) {
        errorMessage = 'Email service configuration error. Please contact support.';
      }
      
      res.status(500).json({
        message: errorMessage
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Reset password - verify token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, businessType } = req.body;

    if (!token || !password || !businessType) {
      return res.status(400).json({ 
        message: 'Token, password, and business type are required' 
      });
    }

    // Validate business type
    if (!Object.values(BusinessType).includes(businessType.toUpperCase())) {
      return res.status(400).json({ 
        message: `Invalid business type. Must be one of: ${Object.values(BusinessType).join(', ')}` 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Hash the token to compare with stored hash
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await Owner.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
      businessType: businessType.toUpperCase()
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};