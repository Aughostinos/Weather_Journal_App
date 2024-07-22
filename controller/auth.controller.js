const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/user.model');

// Signup handler
const signup = () => {
  return async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = { username, email, password: hashedPassword };

      // Create the user
      const createdUser = await createUser(newUser);
      if (!createdUser) {
        return res.status(500).json({ message: 'Failed to create user' });
      }

      // Respond with success message
      res.status(201).json({ message: 'User created successfully', userId: createdUser.UserID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };
};

// Signin handler
const signin = () => {
  return async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find the user by email
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.Email }, 'your_jwt_secret', { expiresIn: '1h' });

      // Respond with the token
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };
};

module.exports = { signup, signin };
