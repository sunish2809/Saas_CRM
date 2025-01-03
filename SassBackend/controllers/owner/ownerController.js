const owner = require("../../models/Owner")

exports.updateOwner = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const owner = await owner.findById(req.owner.id);
      if (name) owner.name = name;
      if (email) owner.email = email;
      if (password) owner.password = password;
      await owner.save();
      res.status(200).json({ message: 'Owner updated' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };