import express from "express";
import Gig from "../models/gig.model.js";

const router = express.Router();

const CATEGORIES = [
  "Plumbing",
  "Electrician",
  "Carpentry",
  "Landscaping",
  "Cleaning",
  "Gardening",
  "Bathroom renovators",
  "Air conditioning services",
  "Painting",
  "Arborist",
];

router.get("/suggestions", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const qLower = q.toLowerCase();

    const catMatches = CATEGORIES.filter((c) =>
      c.toLowerCase().includes(qLower)
    )
      .slice(0, 5)
      .map((c) => ({ type: "cat", value: c }));

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

    const cityMatchesRaw = await Gig.distinct("city", {
      city: { $regex: q, $options: "i" },
    });

    const cityMatches = cityMatchesRaw.slice(0, 5).map((city) => ({
      type: "city",
      value: city,
    }));

    const areaMatchesRaw = await Gig.distinct("area", {
      area: { $regex: q, $options: "i" },
    });

    const areaMatches = areaMatchesRaw.slice(0, 5).map((area) => ({
      type: "area",
      value: area,
    }));

    res.json([...catMatches, ...cityMatches, ...areaMatches, ...gigList]);
  } catch (err) {
    res.status(500).json({ message: "Suggestion error" });
  }
});

export default router;