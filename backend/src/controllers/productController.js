const Product = require("../models/Product");

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

// Crear un producto nuevo
const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    const product = new Product({ name, description, price, category, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
