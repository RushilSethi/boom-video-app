const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const newUser = new User({ name, email, password });
  await newUser.save();

  const token = jwt.sign({ id: newUser._id, name: newUser.name }, JWT_SECRET);
  res.json({ token, user: { name: newUser.name, email: newUser.email, id: newUser._id } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password)
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET);
  res.json({ token, user: { name: user.name, email: user.email, id: user._id } });
});

module.exports = router;
