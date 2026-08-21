// Run once: npm run seed
// Creates the single admin account (from .env) and a few sample questions
// so you have something to test the quiz with immediately.

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Question from "../models/Question.js";
import mongoose from "mongoose";

dotenv.config();

const sampleQuestions = [
  {
    text: "Which HTML tag is used to link an external CSS file?",
    options: ["<style>", "<link>", "<script>", "<css>"],
    correctAnswerIndex: 1,
    category: "Web Dev",
  },
  {
    text: "In React, what hook is used to manage state in a function component?",
    options: ["useEffect", "useContext", "useState", "useRef"],
    correctAnswerIndex: 2,
    category: "React",
  },
  {
    text: "Which HTTP method is typically used to update an existing resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswerIndex: 2,
    category: "Web Dev",
  },
  {
    text: "What does MongoDB use as its primary data format?",
    options: ["XML", "CSV", "BSON/JSON-like documents", "YAML"],
    correctAnswerIndex: 2,
    category: "Database",
  },
  {
    text: "Which of these is NOT a JavaScript array method?",
    options: ["map()", "filter()", "reduce()", "select()"],
    correctAnswerIndex: 3,
    category: "JavaScript",
  },
];

const run = async () => {
  await connectDB();

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists. Skipping admin creation.`);
  } else {
    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ username, password: hashed });
    console.log(`Admin account created -> username: "${username}", password: "${password}"`);
  }

  const questionCount = await Question.countDocuments();
  if (questionCount === 0) {
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} sample questions.`);
  } else {
    console.log(`Questions already exist (${questionCount}). Skipping sample insert.`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
