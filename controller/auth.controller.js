const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/user.model');

// Signup handler
const signup = () => {
  return async (req, res) => {
    try {
      const { email, password } = req.body;
      findUserByEmail(email, async (err, existingUser) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, password: hashedPassword };

        createUser(newUser, (err, userId) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
          }

          res.status(201).json({ message: 'User created successfully', userId });
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// Signin handler
const signin = () => {
  return async (req, res) => {
    try {
      const { email, password } = req.body;
      findUserByEmail(email, async (err, user) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { signup, signin };
