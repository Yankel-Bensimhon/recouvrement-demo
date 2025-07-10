const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // We might not need to issue JWTs from backend if NextAuth handles it all
const db = require('../db');
const router = express.Router();

// POST /api/auth/signup - User registration
router.post('/signup', async (req, res) => {
  const { email, password, company_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = await db.query(
      'INSERT INTO users (email, password_hash, company_name) VALUES ($1, $2, $3) RETURNING id, email, company_name, created_at',
      [email, password_hash, company_name]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// POST /api/auth/login - User login (for NextAuth Credentials provider)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' }); // Password incorrect
    }

    // At this point, credentials are valid.
    // NextAuth's authorize callback expects the user object.
    // We don't need to issue a JWT from here if NextAuth handles session creation based on this response.
    res.status(200).json({
      id: user.id,
      email: user.email,
      company_name: user.company_name, // Or 'name' if NextAuth expects that
      // any other user details NextAuth might need or you want in the session/JWT
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
