const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.createReview);
router.get("/:productId", reviewController.getReviewsForProduct);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

router.get("/:productId/stats", reviewController.getReviewStats);
router.get("/search/:productId", reviewController.searchReviews);

router.post("/:id/vote", reviewController.voteHelpful);

module.exports = router;
