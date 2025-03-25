const Review = require("../models/Review");

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.getAllReviews();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.getReviewById(req.params.id);
    if (!review)
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    res.json(review);
  } catch (err) {
    next(err);
  }
};
const addReview = async (req, res, next) => {
  try {
    const newReview = await Review.createReview(req.body);
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
};
const updateReview = async (req, res, next) => {
  try {
    const updatedReview = await Review.updateReview(req.params.id, req.body);
    if (!updatedReview)
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    res.json(updatedReview);
  } catch (err) {
    next(err);
  }
};
const deleteReview = async (req, res, next) => {
  try {
    await Review.deleteReview(req.params.id);
    res.status(204).json({ message: "Recenzja usunięta" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllReviews,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
};
