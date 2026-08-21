import express from "express";
import protectAdmin from "../middleware/auth.js";
import {
  getQuestionsForQuiz,
  getQuestionsForAdmin,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

// Public
router.get("/", getQuestionsForQuiz);

// Admin only
router.get("/admin", protectAdmin, getQuestionsForAdmin);
router.post("/", protectAdmin, createQuestion);
router.put("/:id", protectAdmin, updateQuestion);
router.delete("/:id", protectAdmin, deleteQuestion);

export default router;
