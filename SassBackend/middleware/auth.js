const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');

exports.authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        // Find owner by id
        const owner = await Owner.findById(decoded.userId);


        if (!owner) {
            throw new Error('Owner not found');
        }

        // Get all business types (prioritize businessTypes array)
        const allBusinessTypes = owner.businessTypes && owner.businessTypes.length > 0 
            ? owner.businessTypes 
            : (owner.businessType ? [owner.businessType] : []);
        
        // Get current business type (from token or owner's currentBusinessType)
        const currentBusinessType = decoded.businessType || owner.currentBusinessType || allBusinessTypes[0] || owner.businessType;

        // Add owner to request (for backward compatibility, also add as req.user)
        req.owner = owner;
        req.user = { 
            userId: owner._id, 
            email: owner.email, 
            businessType: currentBusinessType,
            allBusinessTypes: allBusinessTypes,
            currentBusinessType: currentBusinessType
        };
        next();

    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

// Middleware to allow expired users (for payment/upgrade routes)
exports.allowExpiredUsers = (req, res, next) => {
    // This middleware should be used AFTER authMiddleware
    // It allows users with EXPIRED trial status to proceed
    // Regular authMiddleware already checks authentication, this just allows expired status
    next();
};

const { checkBusinessTypeAccess } = require('../utils/businessTypeAccess');

exports.checkBusinessAccess = (allowedBusinessTypes) => {
    return (req, res, next) => {
        try {
            // Check if owner exists (should be added by authMiddleware)
            if (!req.owner) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Get current business type from request (from token or query param)
            const requestedBusinessType = req.query.businessType || req.body.businessType || req.user?.currentBusinessType || req.owner.currentBusinessType || req.owner.businessType;
            
            if (!requestedBusinessType) {
                return res.status(400).json({ 
                    message: 'Business type is required' 
                });
            }

            // Get all business types user has access to
            const userBusinessTypes = req.owner.businessTypes && req.owner.businessTypes.length > 0 
                ? req.owner.businessTypes 
                : (req.owner.businessType ? [req.owner.businessType] : []);

            // Check if requested business type is in allowed types for this route
            if (!allowedBusinessTypes.includes(requestedBusinessType.toUpperCase())) {
                return res.status(403).json({ 
                    message: `Access denied. ${requestedBusinessType} is not available for this route.` 
                });
            }

            // Check if user has access to this business type based on their membership plan
            const accessCheck = checkBusinessTypeAccess(
                userBusinessTypes, 
                requestedBusinessType, 
                req.owner.membershipType || 'None'
            );

            if (!accessCheck.allowed) {
                return res.status(403).json({ 
                    message: accessCheck.message,
                    upgradeRequired: true
                });
            }

            // Set the current business type in request for use in controllers
            req.currentBusinessType = requestedBusinessType.toUpperCase();
            req.user.currentBusinessType = requestedBusinessType.toUpperCase();

            next();
        } catch (error) {
            console.error('Error checking business access:', error);
            res.status(500).json({ message: 'Error checking business access' });
        }
    };
};
