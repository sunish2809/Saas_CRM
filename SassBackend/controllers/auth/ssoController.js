const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Owner = require('../../models/Owner');
const { canAddBusinessType } = require('../../utils/businessTypeAccess');

const BusinessType = {
  LIBRARY: 'LIBRARY',
  GYM: 'GYM',
  HARDWARE: 'HARDWARE'
};

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token and get user info
 */
const verifyGoogleToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Invalid Google token');
  }
};

/**
 * Google SSO Sign In / Sign Up
 */
exports.googleSSO = async (req, res) => {
  try {
    const { idToken, businessType } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }

    // Validate business type
    if (!businessType || !Object.values(BusinessType).includes(businessType.toUpperCase())) {
      return res.status(400).json({ 
        message: `Invalid business type. Must be one of: ${Object.values(BusinessType).join(', ')}` 
      });
    }

    const normalizedBusinessType = businessType.toUpperCase();

    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);
    const normalizedEmail = googleUser.email.toLowerCase().trim();

    // Check if user exists
    let user = await Owner.findOne({ email: normalizedEmail });

    if (user) {
      // Existing user - check if they have Google SSO linked
      if (!user.googleId) {
        // Link Google account to existing email account
        user.googleId = googleUser.googleId;
        user.ssoProvider = 'google';
        // If user doesn't have a password, they can now use Google SSO
      }

      // Get user's available business types
      const userBusinessTypes = user.businessTypes && user.businessTypes.length > 0 
        ? user.businessTypes 
        : (user.businessType ? [user.businessType] : []);

      // Check if they already have this business type
      if (userBusinessTypes.includes(normalizedBusinessType)) {
        // User already has access - just sign them in
        user.currentBusinessType = normalizedBusinessType;
        await user.save();

        const token = jwt.sign(
          { 
            userId: user._id, 
            businessType: normalizedBusinessType,
            email: user.email 
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Signed in successfully',
          token,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            businessType: normalizedBusinessType,
            allBusinessTypes: userBusinessTypes,
            membershipType: user.membershipType,
            trialStatus: user.trialStatus,
          },
        });
      }

      // Check if they can add this business type
      const canAdd = canAddBusinessType(
        userBusinessTypes, 
        normalizedBusinessType, 
        user.membershipType || 'None'
      );

      if (!canAdd.allowed) {
        return res.status(403).json({
          message: canAdd.message,
          upgradeRequired: true
        });
      }

      // Add business type to user's account
      if (!user.businessTypes || user.businessTypes.length === 0) {
        user.businessTypes = userBusinessTypes;
      }
      if (!user.businessTypes.includes(normalizedBusinessType)) {
        user.businessTypes.push(normalizedBusinessType);
      }
      user.currentBusinessType = normalizedBusinessType;
      await user.save();

      const token = jwt.sign(
        { 
          userId: user._id, 
          businessType: normalizedBusinessType,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        message: 'Business type added successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          businessType: normalizedBusinessType,
          allBusinessTypes: user.businessTypes,
          membershipType: user.membershipType,
          trialStatus: user.trialStatus,
        },
      });
    } else {
      // New user - create account with Google SSO
      const newOwner = await Owner.create({
        email: normalizedEmail,
        name: googleUser.name,
        googleId: googleUser.googleId,
        ssoProvider: 'google',
        businessType: normalizedBusinessType,
        businessTypes: [normalizedBusinessType],
        currentBusinessType: normalizedBusinessType,
        // No password needed for SSO users
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
    }
  } catch (error) {
    console.error('Google SSO error:', error);
    
    if (error.message === 'Invalid Google token') {
      return res.status(401).json({ message: 'Invalid Google authentication token' });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'An account with this email already exists' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error during SSO authentication' });
  }
};

