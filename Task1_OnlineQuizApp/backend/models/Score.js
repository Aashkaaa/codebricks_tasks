import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true, trim: true, maxlength: 40 },
    score: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 0 },
    timeTakenSeconds: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Score", scoreSchema);
