const express = require("express");
const authenticate = require('../middlewares/auth');
const Product = require('../models/Product');
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { verifyToken } = require('../middlewares/authMiddleware');
const authenticateToken = require('../middlewares/authMiddleware')

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Rutas protegidas con middleware de autenticación
router.get("/", protect, getAllProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

// Ruta protegida para agregar productos
router.post("/", protect, async (req, res) => {
  const { name, description, price, inventory } = req.body;
  const newProduct = new Product({ name, description, price, inventory });
  await newProduct.save();
  res.status(201).send(newProduct);
});




// Editar un producto
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});


module.exports = router;
