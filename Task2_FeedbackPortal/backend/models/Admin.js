import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // stored as bcrypt hash
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
