

const library = require("../../models/Library");


exports.addLibraryMembers = async (req, res) => {
    try {
        let {
            name,
            email,
            phone,
            address,
            seatNumber,
            aadharNumber,
            emergencyContact,
            gender,
            dateOfBirth,
            membershipType,
            paymentHistory
        } = req.body;

        // Validation for required fields
        const requiredFields = {
            name,
            email,
            phone,
            address,
            seatNumber,
            aadharNumber,
            emergencyContact,
            gender,
            dateOfBirth,
            membershipType
        };

        // Check for missing fields
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: "Missing required fields", 
                fields: missingFields 
            });
        }

        // Validate membership type
        const validMembershipTypes = ['Basic', 'Standard', 'Premium', 'Annual'];
        if (!validMembershipTypes.includes(membershipType)) {
            return res.status(400).json({ 
                message: "Invalid membership type. Must be one of: Basic, Standard, Premium, Annual" 
            });
        }

        // Clean and format input data
        name = name.trim().replace(/\s+/g, " ");
        email = email.trim().toLowerCase();
        phone = phone.trim();
        address = address.trim().replace(/\s+/g, " ");
        aadharNumber = aadharNumber.trim().replace(/\s+/g, "");
        emergencyContact = emergencyContact.trim();
        gender = gender.trim();

        // Validate date format
        const dateOfBirthObj = new Date(dateOfBirth);
        if (isNaN(dateOfBirthObj.getTime())) {
            return res.status(400).json({ message: "Invalid date of birth format" });
        }

        // Validate and format payment history
        if (!Array.isArray(paymentHistory)) {
            paymentHistory = [];
        } else {
            paymentHistory = paymentHistory.map(payment => {
                if (!payment.amount || isNaN(payment.amount)) {
                    throw new Error("Each payment must have a valid amount");
                }
                return {
                    amount: Number(payment.amount),
                    paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date()
                };
            });
        }

        // Create new member with ownerId from authenticated user
        const newMember = new library({
            ownerId: req.owner._id, // From auth middleware
            name,
            email,
            phone,
            address,
            seatNumber,
            aadharNumber,
            emergencyContact,
            gender,
            dateOfBirth: dateOfBirthObj,
            membershipType,
            paymentHistory
        });

        await newMember.save();
        
        res.status(201).json({ 
            message: "Library Member added successfully", 
            member: newMember 
        });

    } catch (error) {
        if (error.code === 11000) {
            // Check which unique field caused the duplicate error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `${field === 'seatNumber' ? 'Seat number' : 'Aadhar number'} is already in use` 
            });
        }
        
        res.status(500).json({ 
            message: "Error adding member", 
            error: error.message 
        });
    }
};


exports.uploadLibraryMembers = async (req, res) => {
    try {
        const members = req.body;

        console.log("members", members);

        if (!Array.isArray(members)) {
            return res.status(400).json({
                message: "Request body must be an array of members",
            });
        }

        const results = {
            added: [],
            errors: [],
        };

        for (const member of members) {
            try {
                const {
                    name,
                    email,
                    phone,
                    address,
                    seatNumber,
                    aadharNumber,
                    emergencyContact,
                    gender,
                    dateOfBirth,
                    membershipType,
                    paymentHistory,
                } = member;

                // Parse `paymentHistory` if it is a string
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

                const newMember = new library({
                    ownerId: req.owner._id,
                    name,
                    email,
                    phone,
                    address,
                    seatNumber,
                    aadharNumber,
                    emergencyContact,
                    gender,
                    dateOfBirth: new Date(dateOfBirth),
                    membershipType,
                    paymentHistory: parsedPaymentHistory.map(payment => ({
                        amount: payment.amount,
                        paymentDate: new Date(payment.paymentDate),
                    })),
                });

                await newMember.save();
                results.added.push(newMember);
            } catch (err) {
                results.errors.push({
                    member,
                    error: err.message,
                });
            }
        }

        res.status(200).json({
            message: "Processed members",
            results,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error processing members",
            error: error.message,
        });
    }
};




exports.updateLibraryMembers = async (req, res) => {

    const {
        seatNumber,
        membershipType,
        paymentHistory
    } = req.body;

    // Validate required fields
    // Improved validation
    if (!seatNumber) {
        return res.status(400).json({ 
            message: "Seat number is required" 
        });
    }

    if (!paymentHistory) {
        return res.status(400).json({ 
            message: "Payment details are required" 
        });
    }

    if (!paymentHistory.amount || paymentHistory.amount <= 0) {
        return res.status(400).json({ 
            message: "Valid payment amount is required" 
        });
    }

    try {
        // Find member by seat number
        const member = await library.findOne({ seatNumber });
        
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }


        // Create new payment entry
        if(paymentHistory.amount <= 0){
            return res.status(400).json({ message: "Payment amount must be greater than 0" });
        }
        if(membershipType){
            const validMembershipTypes = ['Basic', 'Standard', 'Premium', 'Annual'];
            if (!validMembershipTypes.includes(membershipType)) {
                return res.status(400).json({ 
                    message: "Invalid membership type. Must be one of: Basic, Standard, Premium, Annual" 
                });
            }
            member.membershipType = membershipType;

        }
        const newPayment = {
            amount: paymentHistory.amount,
            paymentDate: paymentHistory.paymentDate || new Date()
        };

        // Add new payment to history array
        member.paymentHistory.push(newPayment);

        // Save the updated member
        await member.save();

        res.status(200).json({ 
            message: "Payment updated successfully", 
            member: member,
            newPayment: newPayment
        });
        
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({ 
            message: "Error updating payment", 
            error: error.message 
        });
    }
};

exports.deleteLibraryMembers = async (req, res) => {
    const { seatNumber } = req.params;


    if (!seatNumber) {
        return res.status(400).json({ message: "Seat number is required" });
    }

    try {
        const member = await library.findOneAndDelete({ seatNumber });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ message: "Error deleting member", error: error.message });
    }
};

exports.getLibraryMembers = async (req, res) => {
    const { seatNumber } = req.body;

    try {
        const member = await library.findOne({ seatNumber });

        if (!member) {
            return res.status(404).json({ message: "No member found with that seat number" });
        }

        res.json(member);
    } catch (error) {
        res.status(500).json({ message: "Error fetching member", error });
    }
};

exports.getAllLibraryMembers = async (req, res) => {
    try {
        const members = await library.find({}, {
            name: 1,
            email: 1,
            seatNumber: 1,
            membershipType: 1,
            paymentHistory: 1,
            _id: 0,
            createdAt:1,
            updatedAt:1,
        });

        if (!members.length) {
            return res.status(404).json({ message: "No members found" });
        }

        res.json(members);
    } catch (error) {
        res.status(500).json({ message: "Error fetching members", error });
    }
};