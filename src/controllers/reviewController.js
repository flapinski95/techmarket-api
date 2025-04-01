const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Nie udało się utworzyć recenzji", error });
  }
};

const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId: Number(productId) })
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Błąd podczas pobierania recenzji", error });
  }
};

const updateReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    }
    res.json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Błąd podczas aktualizacji recenzji", error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Nie znaleziono recenzji do usunięcia" });
    }
    res.json({ message: "Recenzja usunięta" });
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas usuwania recenzji", error });
  }
};

const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;
    const stats = await Review.aggregate([
      { $match: { productId: Number(productId) } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const avg = await Review.aggregate([
      { $match: { productId: Number(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    res.json({ distribution: stats, average: avg[0]?.averageRating ?? 0 });
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas liczenia statystyk", error });
  }
};

const searchReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      q,
      minRating,
      verified,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    let filter = { productId: Number(productId) };
    if (q) filter.$text = { $search: q };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (verified === "true") filter.verifiedPurchase = true;
    if (verified === "false") filter.verifiedPurchase = false;

    const results = await Review.find(filter).sort({
      [sortBy]: order === "desc" ? -1 : 1,
    });
    res.json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Błąd podczas wyszukiwania recenzji", error });
  }
};

const voteHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );
    if (!review)
      return res.status(404).json({ message: "Recenzja nie znaleziona" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Błąd podczas głosowania", error });
  }
};

module.exports = {
  createReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
  getReviewStats,
  searchReviews,
  voteHelpful,
};
