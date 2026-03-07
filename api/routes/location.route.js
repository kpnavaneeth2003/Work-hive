import express from "express";
import Gig from "../models/gig.model.js";

const router = express.Router();

router.get("/cities", async (req, res, next) => {
  try {
    const cities = await Gig.distinct("city", { city: { $ne: null } });
    const cleanCities = cities.filter(Boolean).sort((a, b) => a.localeCompare(b));
    res.status(200).json(cleanCities);
  } catch (err) {
    next(err);
  }
});

router.get("/areas", async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const areas = await Gig.distinct("area", {
      city: { $regex: `^${city}$`, $options: "i" },
      area: { $ne: null },
    });

    const cleanAreas = areas.filter(Boolean).sort((a, b) => a.localeCompare(b));
    res.status(200).json(cleanAreas);
  } catch (err) {
    next(err);
  }
});

export default router;