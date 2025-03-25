const express = require("express");
const {
  getAllReviews,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.post("/", addReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
