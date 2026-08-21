import express from "express";
import { submitQuiz, getLeaderboard } from "../controllers/scoreController.js";

const router = express.Router();

router.post("/submit", submitQuiz);
router.get("/leaderboard", getLeaderboard);

export default router;
