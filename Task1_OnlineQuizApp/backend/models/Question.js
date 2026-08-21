import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length === 4,
        message: "A question must have exactly 4 options.",
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    category: { type: String, default: "General", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
