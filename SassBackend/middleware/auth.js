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

        // Add owner to request
        req.owner = owner;
        next();

    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

exports.checkBusinessAccess = (allowedBusinessTypes) => {
    return (req, res, next) => {
        try {
            // Check if owner exists (should be added by authMiddleware)
            if (!req.owner) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Check if owner's business type is in allowed types


            if (!allowedBusinessTypes.includes(req.owner.businessType)) {
                return res.status(403).json({ 
                    message: 'Access denied. Invalid business type' 
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error checking business access' });
        }
    };
};
