const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/user.model');

// Signup handler
const signup = () => {
  return async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      const existingUser = await findUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = { username, email, password: hashedPassword };

      const createdUser = await createUser(newUser);

      if (!createdUser) {
        return res.status(500).json({ message: 'Failed to create user' });
      }

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

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await findUserByEmail(email);

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ email: user.Email }, 'your_jwt_secret', { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  };
};

module.exports = { signup, signin };
