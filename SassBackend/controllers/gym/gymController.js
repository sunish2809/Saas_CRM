const gym = require("../../models/Gym");
const DeletedGymMember = require("../../models/DeletedGymMemberSchema");
const { checkMemberLimit } = require("../../utils/memberLimits");

exports.addGymMember = async (req, res) => {
  try {
    // Check member limit before adding
    const owner = req.owner;
    const currentMemberCount = await gym.countDocuments({ ownerId: owner._id });
    const limitCheck = checkMemberLimit(currentMemberCount, owner.membershipType);
    
    if (!limitCheck.allowed) {
      return res.status(403).json({
        message: limitCheck.message,
        limit: limitCheck.limit,
        current: limitCheck.current,
        upgradeRequired: true
      });
    }
    let {
      name,
      email,
      address,
      aadharNumber,
      phone,
      membershipType,
      paymentHistory,
      memberNumber,
      emergencyContact,
      gender,
      dateOfBirth,
    } = req.body;

    // Required fields validation
    const requiredFields = {
      name,
      email,
      address,
      aadharNumber,
      phone,
      membershipType,
      memberNumber,
      emergencyContact,
      gender,
      dateOfBirth,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields,
      });
    }

    // Validate membership type
    const validMembershipTypes = ["Basic", "Standard", "Premium", "Annual"];
    if (!validMembershipTypes.includes(membershipType)) {
      return res.status(400).json({
        message:
          "Invalid membership type. Must be one of: Basic, Standard, Premium, Annual",
      });
    }

    // Format and clean input data
    name = name.trim().replace(/\s+/g, " ");
    email = email.trim().toLowerCase();
    address = address.trim().replace(/\s+/g, " ");
    aadharNumber = aadharNumber.trim().replace(/\s+/g, "");
    emergencyContact = emergencyContact.trim();
    gender = gender.trim();

    // Validate date format
    const dateOfBirthObj = new Date(dateOfBirth);
    if (isNaN(dateOfBirthObj.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth format" });
    }

    // Format payment history
    if (!Array.isArray(paymentHistory)) {
      paymentHistory = [];
    } else {
      paymentHistory = paymentHistory.map((payment) => {
        if (!payment.amount || isNaN(payment.amount)) {
          throw new Error("Each payment must have a valid amount");
        }
        return {
          amount: Number(payment.amount),
          paymentDate: payment.paymentDate
            ? new Date(payment.paymentDate)
            : new Date(),
        };
      });
    }

    // Create new gym member
    const newMember = new gym({
      ownerId: req.owner._id, // From authentication middleware
      name,
      email,
      address,
      aadharNumber,
      phone,
      emergencyContact,
      gender,
      dateOfBirth: dateOfBirthObj,
      membershipType,
      memberNumber,
      paymentHistory,
    });

    await newMember.save();

    res.status(201).json({
      message: "Gym Member added successfully",
      member: newMember,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${
          field === "memberNumber" ? "Member number" : "Aadhar number"
        } is already in use`,
      });
    }
    res.status(500).json({
      message: "Error adding member",
      error: error.message,
    });
  }
};

exports.uploadGymMembers = async (req, res) => {
  try {
    const members = req.body;

    if (!Array.isArray(members)) {
      return res
        .status(400)
        .json({ message: "Request body must be an array of members" });
    }

    // Check member limit before bulk upload
    const owner = req.owner;
    const currentMemberCount = await gym.countDocuments({ ownerId: owner._id });
    const limitCheck = checkMemberLimit(currentMemberCount, owner.membershipType);
    
    // Check if adding all members would exceed limit
    if (limitCheck.limit !== null && (currentMemberCount + members.length) > limitCheck.limit) {
      const canAdd = limitCheck.limit - currentMemberCount;
      return res.status(403).json({
        message: `Cannot add ${members.length} members. Your ${owner.membershipType} plan allows up to ${limitCheck.limit} members. You currently have ${currentMemberCount} members and can add ${canAdd} more. Please upgrade to add more members.`,
        limit: limitCheck.limit,
        current: currentMemberCount,
        requested: members.length,
        canAdd: canAdd > 0 ? canAdd : 0,
        upgradeRequired: true
      });
    }

    const results = { added: [], errors: [] };

    for (const member of members) {
      try {
        // Check limit before each member addition
        const currentCount = await gym.countDocuments({ ownerId: owner._id });
        const limitCheck = checkMemberLimit(currentCount, owner.membershipType);
        
        if (!limitCheck.allowed) {
          results.errors.push({ 
            member, 
            error: limitCheck.message 
          });
          continue;
        }

        const {
          name,
          email,
          phone,
          address,
          aadharNumber,
          mobile,
          emergencyContact,
          gender,
          dateOfBirth,
          membershipType,
          memberNumber,
          paymentHistory,
        } = member;

        // Validate required fields
        if (!name || !email || !phone || !aadharNumber || !memberNumber) {
          throw new Error(`Missing required fields. Required: Name, Email, Phone, Aadhar Number, Member Number`);
        }

        // Set defaults for optional fields
        const finalGender = gender || 'Male';
        const finalAddress = address || 'Not provided';
        const finalEmergencyContact = emergencyContact || phone;
        const finalMembershipType = membershipType || 'Basic';

        // Parse payment history if string
        let parsedPaymentHistory = [];
        if (typeof paymentHistory === "string") {
          try {
            parsedPaymentHistory = JSON.parse(
              paymentHistory.replace(/'/g, '"')
            );
          } catch (parseError) {
            throw new Error(
              `Invalid paymentHistory format: ${parseError.message}`
            );
          }
        } else if (Array.isArray(paymentHistory)) {
          parsedPaymentHistory = paymentHistory;
        }

        // Parse date of birth
        let dateOfBirthObj;
        if (dateOfBirth) {
          if (typeof dateOfBirth === 'string' && dateOfBirth.includes('/')) {
            const [day, month, year] = dateOfBirth.split('/');
            dateOfBirthObj = new Date(`${year}-${month}-${day}`);
          } else {
            dateOfBirthObj = new Date(dateOfBirth);
          }
        } else {
          dateOfBirthObj = new Date('1990-01-01');
        }

        const newMember = new gym({
          ownerId: req.owner._id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim().replace(/\D/g, ''),
          address: finalAddress.trim(),
          aadharNumber: aadharNumber.trim().replace(/\D/g, ''),
          emergencyContact: finalEmergencyContact.trim().replace(/\D/g, ''),
          gender: finalGender.trim(),
          dateOfBirth: dateOfBirthObj,
          membershipType: finalMembershipType.trim(),
          memberNumber: String(memberNumber).trim(),
          paymentHistory: parsedPaymentHistory.length > 0 
            ? parsedPaymentHistory.map((payment) => ({
                amount: Number(payment.amount) || 0,
                paymentDate: new Date(payment.paymentDate || new Date()),
              }))
            : [],
        });



        await newMember.save();
        results.added.push(newMember);
      } catch (err) {
        results.errors.push({ member, error: err.message });
      }
    }

    res.status(200).json({ message: "Processed gym members", results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing members", error: error.message });
  }
};

// Update gym member's payment
exports.updateGymMember = async (req, res) => {
  const { memberNumber, membershipType, paymentHistory } = req.body;

  if (!memberNumber) {
    return res.status(400).json({ message: "Member number is required" });
  }

  if (!paymentHistory || !paymentHistory.amount || paymentHistory.amount <= 0) {
    return res
      .status(400)
      .json({ message: "Valid payment details are required" });
  }

  try {
    const member = await gym.findOne({ memberNumber });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (membershipType) {
      const validMembershipTypes = ["Basic", "Standard", "Premium", "Annual"];
      if (!validMembershipTypes.includes(membershipType)) {
        return res.status(400).json({ message: "Invalid membership type" });
      }
      member.membershipType = membershipType;
    }

    const newPayment = {
      amount: paymentHistory.amount,
      paymentDate: paymentHistory.paymentDate || new Date(),
    };

    member.paymentHistory.push(newPayment);
    await member.save();

    res
      .status(200)
      .json({ message: "Payment updated successfully", member, newPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment", error: error.message });
  }
};

// Delete gym member
exports.deleteGymMember = async (req, res) => {
  const { memberNumber } = req.params;

  if (!memberNumber) {
    return res.status(400).json({ message: "Member number is required" });
  }

  try {
    const member = await gym.findOneAndDelete({ memberNumber });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await DeletedGymMember.create({ memberNumber });

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting member", error: error.message });
  }
};

// Get single gym member
exports.getGymMember = async (req, res) => {
  const { memberNumber } = req.params;

  if (!memberNumber || memberNumber === 'undefined') {
    return res.status(400).json({ 
      message: "Member number is required and cannot be undefined" 
    });
  }

  try {
    // Convert to number if it's a string
    const memberNum = isNaN(memberNumber) ? memberNumber : Number(memberNumber);
    
    const member = await gym.findOne({ 
      ownerId: req.owner._id,
      memberNumber: memberNum 
    });

    if (!member) {
      return res
        .status(404)
        .json({ message: "No member found with that number" });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching gym member:', error);
    res.status(500).json({ 
      message: "Error fetching member", 
      error: error.message 
    });
  }
};

// Get all gym members
exports.getAllGymMembers = async (req, res) => {
  try {
    // Filter by ownerId to ensure users only see their own members
    const members = await gym.find(
      { ownerId: req.owner._id },
      { name: 1, email: 1, memberNumber: 1, membershipType: 1, paymentHistory: 1, _id: 1 }
    );

    if (!members.length) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.json(members);
  } catch (error) {
    console.error('Error fetching gym members:', error);
    res.status(500).json({ 
      message: "Error fetching members", 
      error: error.message 
    });
  }
};

// Get deleted members stats
exports.getDeletedGymMembersStats = async (req, res) => {
  try {
    const stats = await DeletedGymMember.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$deletedAt" },
            month: { $month: "$deletedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
};
