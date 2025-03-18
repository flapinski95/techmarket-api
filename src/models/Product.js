const pool = require("../config/db");

const getAllProducts = async (filters = {}) => {
  let baseQuery = "SELECT * FROM products";
  const conditions = [];
  const values = [];

  if (filters.available !== undefined) {
    conditions.push("is_available = $" + (values.length + 1));
    values.push(filters.available);
  }

  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }

  if (filters.sortByPrice) {
    baseQuery += ` ORDER BY price ${
      filters.sortByPrice === "desc" ? "DESC" : "ASC"
    }`;
  }

  const { rows } = await pool.query(baseQuery, values);
  return rows;
};

const getProductById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
    id,
  ]);
  return rows[0];
};

const createProduct = async (product) => {
  const { name, category, description, price, stockCount, brand, imageUrl } =
    product;
  const isAvailable = stockCount > 0;
  const { rows } = await pool.query(
    `INSERT INTO products 
    (name, category, description, price, stock_count, brand, image_url, is_available)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      name,
      category,
      description,
      price,
      stockCount,
      brand,
      imageUrl,
      isAvailable,
    ]
  );
  return rows[0];
};

const updateProduct = async (id, product) => {
  const { name, category, description, price, stockCount, brand, imageUrl } =
    product;
  const isAvailable = stockCount > 0;

  const { rows } = await pool.query(
    `UPDATE products SET 
      name = $1, category = $2, description = $3, price = $4, 
      stock_count = $5, brand = $6, image_url = $7, is_available = $8
    WHERE id = $9 RETURNING *`,
    [
      name,
      category,
      description,
      price,
      stockCount,
      brand,
      imageUrl,
      isAvailable,
      id,
    ]
  );
  return rows[0];
};

const deleteProduct = async (id) => {
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
