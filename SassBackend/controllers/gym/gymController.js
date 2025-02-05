const gym = require("../../models/Gym");

const DeletedGymMember = require("../../models/DeletedGymMemberSchema");

exports.addGymMember = async (req, res) => {
  try {
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

    const results = { added: [], errors: [] };

    for (const member of members) {
      try {
        const {
          name,
          email,
          phone, // ✅ Missing field added
          address,
          aadharNumber, // ✅ Corrected field name (previously 'aadhar')
          mobile,
          emergencyContact,
          gender,
          dateOfBirth,
          membershipType,
          memberNumber,
          paymentHistory,
        } = member;

        // Ensure all required fields are present
        if (!phone || !aadharNumber) {
          throw new Error("Phone and Aadhar Number are required.");
        }

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

        const newMember = new gym({
          ownerId: req.owner._id,
          name,
          email,
          phone, // ✅ Now included
          address,
          aadharNumber, // ✅ Correct field name
          mobile,
          emergencyContact,
          gender,
          dateOfBirth: new Date(dateOfBirth),
          membershipType,
          memberNumber,
          paymentHistory: parsedPaymentHistory.map((payment) => ({
            amount: payment.amount,
            paymentDate: new Date(payment.paymentDate),
          })),
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

  try {
    const member = await gym.findOne({ memberNumber });

    if (!member) {
      return res
        .status(404)
        .json({ message: "No member found with that number" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member", error });
  }
};

// Get all gym members
exports.getAllGymMembers = async (req, res) => {
  try {
    const members = await gym.find(
      {},
      { name: 1, memberNumber: 1, membershipType: 1, paymentHistory: 1, _id: 0 }
    );

    if (!members.length) {
      return res.status(404).json({ message: "No members found" });
    }

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching members", error });
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
