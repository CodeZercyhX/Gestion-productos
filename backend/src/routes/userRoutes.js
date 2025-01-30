const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta para registro de usuario
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const newUser = new User({ email, password });
  await newUser.save();
  const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
  res.send({ token });
});

// Ruta para login de usuario
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).send('Credenciales incorrectas');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  });
  
module.exports = router;
