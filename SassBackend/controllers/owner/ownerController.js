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
