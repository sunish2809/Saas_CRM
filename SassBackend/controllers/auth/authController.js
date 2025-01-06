
const jwt = require('jsonwebtoken');
const  bcrypt  = require( 'bcrypt');
const   Owner   =require( '../../models/Owner'); // You'll need to create this model
// const { BusinessType } = require( '../../business');

const BusinessType = {
  LIBRARY: 'LIBRARY',
  GYM: 'GYM',
  FLAT: 'FLAT'
};

exports.signUp = async(req,res) =>{
  try {
    const { email, password,  name,businessType } = req.body;
    console.log('Received signup request:', { email, businessType, name });

    // Validate business type
    if (!Object.values(BusinessType).includes(businessType)) {
      return res.status(400).json({ message: 'Invalid business type' });
    }

    // Check if user already exists
    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await Owner.create({
      email,
      password: hashedPassword,
      businessType,
      name,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, businessType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        businessType: user.businessType,
      },
    });
  } catch (error) {
    console.error('SignUp error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.signIn = async(req, res)=>{
  try {
    const { email, password, businessType } = req.body;

    // Find user
    const user = await Owner.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify business type
    if (user.businessType !== businessType) {
      return res.status(401).json({ message: 'Invalid business type for this user' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, businessType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        businessType: user.businessType,
      },
    });
  } catch (error) {
    console.error('SignIn error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}