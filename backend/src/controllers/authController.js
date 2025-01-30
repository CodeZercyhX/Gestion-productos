const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Usuario ya registrado" });

    const user = await User.create({ email, password });
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};
module.exports = { registerUser, loginUser };