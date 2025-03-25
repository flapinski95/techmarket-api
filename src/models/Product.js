const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllProducts = async (filters = {}) => {
  const where = {};
  const orderBy = [];

  if (filters.available !== undefined) {
    where.isAvailable = filters.available;
  }

  if (filters.sortByPrice) {
    orderBy.push({
      price: filters.sortByPrice === "desc" ? "desc" : "asc",
    });
  }

  return await prisma.product.findMany({
    where,
    orderBy,
  });
};

const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id: Number(id) },
  });
};

const createProduct = async (product) => {
  const { name, categoryId, description, price, stockCount, brand, imageUrl } =
    product;

  const isAvailable = stockCount > 0;

  return await prisma.product.create({
    data: {
      name,
      categoryId,
      description,
      price,
      stockCount,
      brand,
      imageUrl,
      isAvailable,
    },
  });
};

const updateProduct = async (id, product) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Produkt nie istnieje");
  }
  const { name, category, description, price, stockCount, brand, imageUrl } =
    product;

  const isAvailable = stockCount > 0;

  return await prisma.product.update({
    where: { id },
    data: {
      name,
      category,
      description,
      price,
      stockCount,
      brand,
      imageUrl,
      isAvailable,
    },
  });
};

const deleteProduct = async (id) => {
  return await prisma.product.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
