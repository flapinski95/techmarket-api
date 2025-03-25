const Product = require("../models/Product");

const getAllProducts = async (req, res, next) => {
  try {
    const { available, sort } = req.query;
    const filters = {
      available: available !== undefined ? available === "true" : undefined,
      sortByPrice: sort,
    };
    const products = await Product.getAllProducts(filters);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.getProductById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const addProduct = async (req, res, next) => {
  if (!req.body.categoryId) {
    return res.status(400).json({ error: "Pole categoryId jest wymagane." });
  }

  try {
    const newProduct = await Product.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.updateProduct(req.params.id, req.body);
    if (!updatedProduct)
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await Product.deleteProduct(req.params.id);
    res.status(204).json({ message: "Produkt usunięty" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
