import Review from "../models/Review.js";
import Item from "../models/Item.js";

// POST /api/reviews
// Public - anyone can submit a review, but it starts as "pending"
export const submitReview = async (req, res) => {
  try {
    const { itemId, reviewerName, rating, comment } = req.body;

    if (!itemId || !reviewerName || !rating || !comment) {
      return res.status(400).json({
        message: "itemId, reviewerName, rating, and comment are all required",
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const review = await Review.create({
      item: itemId,
      reviewerName,
      rating,
      comment,
      status: "pending",
    });

    res.status(201).json({
      message: "Thanks! Your review has been submitted and is awaiting approval.",
      review,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/reviews/pending
// Admin only - reviews awaiting moderation
export const getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: "pending" })
      .populate("item", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/reviews/all
// Admin only - every review, any status (for a full moderation view)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("item", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/reviews/:id/approve
// Admin only
export const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/reviews/:id
// Admin only - reject/remove a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
