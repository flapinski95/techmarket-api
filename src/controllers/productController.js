const products = require("../data/products");

const getAllProducts = (req, res) => {
  res.json(products);
};

const getProductById = (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Produkt nie znaleziony" });
  }
  res.json(product);
};

const addProduct = (req, res) => {
  const { name, category, description, price, stockCount, brand, imageUrl } =
    req.body;

  if (!name || !category || !price || !stockCount) {
    return res.status(400).json({ message: "Brak wymaganych danych" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    category,
    description,
    price,
    stockCount,
    brand,
    imageUrl,
    isAvailable: stockCount > 0,
    createdAt: new Date().toISOString(),
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Produkt nie znaleziony" });
  }

  const { name, category, description, price, stockCount, brand, imageUrl } =
    req.body;

  product.name = name || product.name;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price || product.price;
  product.stockCount =
    stockCount !== undefined ? stockCount : product.stockCount;
  product.brand = brand || product.brand;
  product.imageUrl = imageUrl || product.imageUrl;
  product.isAvailable = stockCount > 0;

  res.json(product);
};

const deleteProduct = (req, res) => {
  const index = products.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Produkt nie znaleziony" });
  }

  products.splice(index, 1);
  res.json({ message: "Produkt usunięty" });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
