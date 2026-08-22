import express from "express";
import protectAdmin from "../middleware/auth.js";
import {
  submitReview,
  getPendingReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Public
router.post("/", submitReview);

// Admin only
router.get("/pending", protectAdmin, getPendingReviews);
router.get("/all", protectAdmin, getAllReviews);
router.put("/:id/approve", protectAdmin, approveReview);
router.delete("/:id", protectAdmin, deleteReview);

export default router;
