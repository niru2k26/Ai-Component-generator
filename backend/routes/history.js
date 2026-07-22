import express from "express";
import History from "../models/History.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save generated code
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { prompt, framework, code } = req.body;

    if (!prompt || !framework || !code) {
      return res.status(400).json("All fields are required");
    }

    const newHistory = await History.create({
      userId: req.userId,
      prompt,
      framework,
      code,
    });

    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json("Failed to save history");
  }
});

// Get logged-in user's history
router.get("/", authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json("Failed to fetch history");
  }
});

// Get single history item
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await History.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!item) {
      return res.status(404).json("History not found");
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json("Failed to fetch history item");
  }
});

export default router;