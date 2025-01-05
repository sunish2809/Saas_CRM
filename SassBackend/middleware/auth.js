
const  jwt = require( 'jsonwebtoken');
const  { User } = require( '../models/Owner');



exports.authMiddleware = async (
req,res,next
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) /*as JWTPayload*/;

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user and business type to request object
    req.user = user;
    req.businessType = decoded.businessType;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check business type access
exports.checkBusinessAccess = (allowedTypes) => {
  return (req, res, next) => {
    if (!req.businessType || !allowedTypes.includes(req.businessType)) {
      return res.status(403).json({ 
        message: 'You do not have access to this business type' 
      });
    }
    next();
  };
};