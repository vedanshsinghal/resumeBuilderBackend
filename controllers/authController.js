const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc Register a new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    /* What is a Salt? Imagine two different users both use the password "qwerty".
    If you just scrambled them, they would look exactly the same in the database.
    A hacker could notice this pattern.
    How it works: A "salt" generates a blast of random gibberish and glues it to
    the password before scrambling it. This guarantees that even if 100 people use
    the exact same password, every single one will look completely unique and
    unrecognizable in your database. */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and save the user
    user = new User({ 
        name,email, password: hashedPassword });
    await user.save();

    // 4. Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, name:user.name, userId: user._id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc Login a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }// status 400 = bad request

    // 2. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate a JWT token, user_.id is mongodb wali id
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, userId: user._id, name:user.name, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { register, login };