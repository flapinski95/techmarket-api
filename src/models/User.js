const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (user) => {
  const { username, email, passwordHash, firstName, lastName } = user;

  return await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      firstName,
      lastName,
    },
  });
};
const getAllUsers = async () => {
  return await prisma.user.findMany();
};
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
  });
};
const updateUser = async (id, user) => {
  const existing = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return res.status(404).json({ message: "Produkt nie istnieje" });
  }
  const { username, email, passwordHash, firstName, lastName } = user;

  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      username,
      email,
      passwordHash,
      firstName,
      lastName,
    },
  });
};
const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
};
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
