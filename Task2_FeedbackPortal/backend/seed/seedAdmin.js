// Run once: npm run seed
// Creates the single admin account (from .env) and a few sample items
// so you have something to test the portal with immediately.

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";
import Item from "../models/Item.js";
import mongoose from "mongoose";

dotenv.config();

const sampleItems = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "Over-ear headphones with active noise cancellation and 30-hour battery life.",
    category: "Electronics",
  },
  {
    name: "Neighborhood Coffee Roasters",
    description: "Local cafe known for single-origin pour-overs and fresh pastries.",
    category: "Food & Beverage",
  },
  {
    name: "QuickFix Home Cleaning Service",
    description: "On-demand home cleaning service booked by the hour.",
    category: "Services",
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

  const itemCount = await Item.countDocuments();
  if (itemCount === 0) {
    await Item.insertMany(sampleItems);
    console.log(`Inserted ${sampleItems.length} sample items.`);
  } else {
    console.log(`Items already exist (${itemCount}). Skipping sample insert.`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
