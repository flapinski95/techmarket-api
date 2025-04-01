const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBasket = async (basket) => {
  const { userId, productId, amount } = basket;

  return await prisma.basket.create({
    data: {
      userId,
      productId,
      amount,
    },
  });
};
const addProductToBasket = async (basket) => {
  const { userId, productId, amount } = basket;

  const existing = await prisma.basket.findFirst({
    where: {
      userId: Number(userId),
      productId: Number(productId),
    },
  });

  if (existing) {
    return await prisma.basket.update({
      where: {
        id: existing.id,
      },
      data: {
        amount: existing.amount + amount,
      },
    });
  }

  return await prisma.basket.create({
    data: {
      userId,
      productId,
      amount,
    },
  });
};
const getBasketById = async (id) => {
  return await prisma.basket.findUnique({
    where: { id: Number(id) },
  });
};
const getAllBaskets = async () => {
  return await prisma.basket.findMany();
};
const deleteBasket = async (id) => {
  return await prisma.basket.delete({
    where: { id: Number(id) },
  });
};
const updateBasket = async (id, basket) => {
  const existing = await prisma.basket.findUnique({
    where: { id: Number(id) },
  });
  if (!existing) {
    return res.status(404).json({ message: "Produkt nie istnieje" });
  }
  const { userId, productId, amount } = basket;

  return await prisma.basket.update({
    where: { id: Number(id) },
    data: {
      userId,
      productId,
      amount,
    },
  });
};
module.exports = {
  createBasket,
  addProductToBasket,
  getBasketById,
  getAllBaskets,
  deleteBasket,
  updateBasket,
};
