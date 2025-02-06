const Owner = require("../../models/Owner");
const bcrypt = require('bcrypt');
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
      const owner = await Owner.findOne(
        { _id: req.owner._id },  // Filter by logged-in owner
        { 
          email: 1, 
          name: 1, 
          businessType: 1,
          trialStatus: 1,
          trialStartDate: 1,
          membershipType: 1 
        }
      );
  
      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }
  
      res.json(owner);
    } catch (error) {
      res.status(500).json({ message: "Error fetching owner", error: error.message });
    }
  };
  
