const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createReview = async (review) => {
  const { productId, userId, rating, comment } = review;

  return await prisma.review.create({
    data: {
      productId,
      userId,
      rating,
      comment,
    },
  });
};

const getReviewById = async (id) => {
  return await prisma.review.findUnique({
    where: { id: Number(id) },
  });
};
const getAllReviews = async () => {
  return await prisma.review.findMany();
};
const deleteReview = async (id) => {
  return await prisma.review.delete({
    where: { id: Number(id) },
  });
};
const updateReview = async (id, review) => {
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ message: "Produkt nie istnieje" });
  }
  const { productId, userId, rating, comment } = review;

  return await prisma.review.update({
    where: { id: Number(id) },
    data: {
      productId,
      userId,
      rating,
      comment,
    },
  });
};
module.exports = {
  createReview,
  getReviewById,
  getAllReviews,
  deleteReview,
  updateReview,
};
