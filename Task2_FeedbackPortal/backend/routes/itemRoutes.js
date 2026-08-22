import express from "express";
import protectAdmin from "../middleware/auth.js";
import { getItems, getItemById, createItem, deleteItem } from "../controllers/itemController.js";

const router = express.Router();

// Public
router.get("/", getItems);
router.get("/:id", getItemById);

// Admin only
router.post("/", protectAdmin, createItem);
router.delete("/:id", protectAdmin, deleteItem);

export default router;
