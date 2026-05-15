const mongoose = require("mongoose");
const Product = require("../models/Product");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const createProduct = async (req, res) => {
  const { name, price, description, category, inStock, imageUrl } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (price === undefined || price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      category,
      inStock,
      imageUrl,
    });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  if (req.body.price !== undefined && req.body.price <= 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ error: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
