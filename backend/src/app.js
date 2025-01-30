const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

module.exports = app;
