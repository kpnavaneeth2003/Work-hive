import express from "express";
import Category from "../models/category.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.status(200).send(categories);
});

export default router;
