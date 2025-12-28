const Owner = require("../../models/Owner");
const bcrypt = require('bcrypt');
const gym = require("../../models/Gym");
const library = require("../../models/Library");
const { getMemberLimit, checkMemberLimit } = require("../../utils/memberLimits");
const { canAddBusinessType, getAvailableBusinessTypes } = require("../../utils/businessTypeAccess");
exports.updateOwner = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Find the owner based on the authenticated user
        const owner = await Owner.findById(req.owner.id);

        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        // Ensure the update applies only to the authenticated user's business
        if (req.owner.businessType !== owner.businessType) {
            return res.status(403).json({ message: "Unauthorized to update this owner" });
        }

        // Update the fields if provided
        const hashedPassword = await bcrypt.hash(password, 10);
        if (name) owner.name = name;
        if (email) owner.email = email;
        if (hashedPassword) owner.password = hashedPassword;

        await owner.save();
        res.status(200).json({ message: `Owner updated for ${owner.businessType}` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// exports.getOwner= async(req, res) =>{

//     try {
//     const owner = await Owner.find(
//         {},
//         { email: 1, password: 1, name: 1, businessType: 1,trialStatus:1,trialStartDate:1,membershipType:1, _id: 0 }
//     );

//     if (!owner.length) {
//         return res.status(404).json({ message: "No owner found" });
//     }

//     res.json(owner);
//     } catch (error) {
//     res.status(500).json({ message: "Error fetching owner", error });
//     }

// }

exports.getOwner = async (req, res) => {
    try {
      // Ensure the user is authenticated
      if (!req.owner || !req.owner._id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      // Find owner by ID
      const owner = await Owner.findById(req.owner._id);
  
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }

      // Get all business types
      const allBusinessTypes = owner.businessTypes && owner.businessTypes.length > 0 
        ? owner.businessTypes 
        : (owner.businessType ? [owner.businessType] : []);

      // Get available business types based on plan
      const availableBusinessTypes = getAvailableBusinessTypes(allBusinessTypes, owner.membershipType || 'None');
  
      res.json({
        email: owner.email,
        name: owner.name,
        businessType: owner.currentBusinessType || owner.businessType,
        allBusinessTypes: allBusinessTypes,
        currentBusinessType: owner.currentBusinessType || owner.businessType,
        availableBusinessTypes: availableBusinessTypes,
        trialStatus: owner.trialStatus,
        trialStartDate: owner.trialStartDate,
        membershipType: owner.membershipType,
        createdAt: owner.createdAt
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching owner", error: error.message });
    }
  };

// Get member limits and current count for the owner
exports.getMemberLimits = async (req, res) => {
  try {
    if (!req.owner || !req.owner._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner = req.owner;
    const membershipType = owner.membershipType || "None";
    const limit = getMemberLimit(membershipType);

    // Get current business type from query param or use owner's current
    const currentBusinessType = req.query.businessType || req.owner.currentBusinessType || req.owner.businessType;

    // Count members based on current business type
    let currentCount = 0;
    if (currentBusinessType === "GYM") {
      currentCount = await gym.countDocuments({ ownerId: owner._id });
    } else if (currentBusinessType === "LIBRARY") {
      currentCount = await library.countDocuments({ ownerId: owner._id });
    }

    const limitCheck = checkMemberLimit(currentCount, membershipType);

    res.json({
      membershipType,
      businessType: currentBusinessType,
      limit: limit,
      current: currentCount,
      remaining: limit === null ? null : Math.max(0, limit - currentCount),
      isUnlimited: limit === null,
      canAddMore: limitCheck.allowed,
      message: limitCheck.message
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching member limits", error: error.message });
  }
};

// Switch current business type
exports.switchBusinessType = async (req, res) => {
  try {
    if (!req.owner || !req.owner._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { businessType } = req.body;
    if (!businessType) {
      return res.status(400).json({ message: "Business type is required" });
    }

    const owner = await Owner.findById(req.owner._id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const normalizedBusinessType = businessType.toUpperCase();
    const userBusinessTypes = owner.businessTypes && owner.businessTypes.length > 0 
      ? owner.businessTypes 
      : (owner.businessType ? [owner.businessType] : []);

    // Check if user has access to this business type
    const { checkBusinessTypeAccess } = require("../../utils/businessTypeAccess");
    const accessCheck = checkBusinessTypeAccess(
      userBusinessTypes,
      normalizedBusinessType,
      owner.membershipType || 'None'
    );

    if (!accessCheck.allowed) {
      return res.status(403).json({
        message: accessCheck.message,
        upgradeRequired: true
      });
    }

    // Update current business type
    owner.currentBusinessType = normalizedBusinessType;
    await owner.save();

    // Generate new JWT token with updated business type
    const jwt = require('jsonwebtoken');
    const newToken = jwt.sign(
      { 
        userId: owner._id, 
        businessType: normalizedBusinessType,
        email: owner.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Business type switched successfully",
      token: newToken, // Return new token with updated businessType
      user: {
        id: owner._id,
        email: owner.email,
        name: owner.name,
        businessType: normalizedBusinessType,
        currentBusinessType: normalizedBusinessType,
        allBusinessTypes: userBusinessTypes,
        membershipType: owner.membershipType,
        trialStatus: owner.trialStatus,
      },
      currentBusinessType: normalizedBusinessType,
      allBusinessTypes: userBusinessTypes
    });
  } catch (error) {
    res.status(500).json({ message: "Error switching business type", error: error.message });
  }
};

// Add a new business type to account
exports.addBusinessType = async (req, res) => {
  try {
    if (!req.owner || !req.owner._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { businessType } = req.body;
    if (!businessType) {
      return res.status(400).json({ message: "Business type is required" });
    }

    const owner = await Owner.findById(req.owner._id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const normalizedBusinessType = businessType.toUpperCase();
    const userBusinessTypes = owner.businessTypes && owner.businessTypes.length > 0 
      ? owner.businessTypes 
      : (owner.businessType ? [owner.businessType] : []);

    // Check if can add this business type
    const canAdd = canAddBusinessType(
      userBusinessTypes,
      normalizedBusinessType,
      owner.membershipType || 'None'
    );

    if (!canAdd.allowed) {
      return res.status(403).json({
        message: canAdd.message,
        upgradeRequired: true
      });
    }

    // Add business type
    if (!owner.businessTypes || owner.businessTypes.length === 0) {
      owner.businessTypes = userBusinessTypes;
    }
    if (!owner.businessTypes.includes(normalizedBusinessType)) {
      owner.businessTypes.push(normalizedBusinessType);
    }
    owner.currentBusinessType = normalizedBusinessType;
    await owner.save();

    res.json({
      message: "Business type added successfully",
      allBusinessTypes: owner.businessTypes,
      currentBusinessType: normalizedBusinessType
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding business type", error: error.message });
  }
};
  
