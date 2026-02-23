import express from "express";
import Gig from "../models/gig.model.js";

const router = express.Router();

const CATEGORIES = [
  "Plumbing",
  "Electrician",
  "Carpentry",
  "Landscaping",
  "Cleaning",
  "Air Conditioning services",
  "Painting",
  "Arborist",
  "Bathroom renovators",
];

router.get("/suggestions", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const qLower = q.toLowerCase();

    // Category suggestions
    const catMatches = CATEGORIES.filter((c) => c.toLowerCase().includes(qLower))
      .slice(0, 5)
      .map((c) => ({ type: "cat", value: c }));

    // Gig title suggestions
    const gigMatches = await Gig.find({
      title: { $regex: q, $options: "i" },
    })
      .select("_id title")
      .limit(5);

    const gigList = gigMatches.map((g) => ({
      type: "gig",
      value: g.title,
      id: g._id,
    }));

    res.json([...catMatches, ...gigList]);
  } catch (err) {
    res.status(500).json({ message: "Suggestion error" });
  }
});

export default router;