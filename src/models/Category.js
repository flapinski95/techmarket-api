const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCategory = async (category) => {
  const { name, description } = category;

  return await prisma.category.create({
    data: {
      name,
      description,
    },
  });
};
const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id: Number(id) },
  });
};
const getAllCategories = async () => {
  return await prisma.category.findMany();
};
const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id: Number(id) },
  });
};
const updateCategory = async (id, category) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Produkt nie istnieje" });
  }
  const { name, description } = category;

  return await prisma.category.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
    },
  });
};
module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
  deleteCategory,
  updateCategory,
};
