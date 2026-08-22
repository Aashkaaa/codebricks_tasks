import Item from "../models/Item.js";
import Review from "../models/Review.js";

// GET /api/items
// Public - list all items with their average rating + approved review count
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    const itemsWithStats = await Promise.all(
      items.map(async (item) => {
        const approvedReviews = await Review.find({ item: item._id, status: "approved" });
        const avgRating =
          approvedReviews.length > 0
            ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
            : 0;
        return {
          ...item.toObject(),
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: approvedReviews.length,
        };
      })
    );

    res.json(itemsWithStats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/items/:id
// Public - item details + its approved reviews (most recent first)
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const approvedReviews = await Review.find({ item: item._id, status: "approved" }).sort({
      createdAt: -1,
    });

    const avgRating =
      approvedReviews.length > 0
        ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
        : 0;

    res.json({
      ...item.toObject(),
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: approvedReviews.length,
      reviews: approvedReviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/items
// Admin only
export const createItem = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }
    const item = await Item.create({ name, description, category });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/items/:id
// Admin only - also removes its reviews
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    await Review.deleteMany({ item: item._id });
    res.json({ message: "Item and its reviews deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
