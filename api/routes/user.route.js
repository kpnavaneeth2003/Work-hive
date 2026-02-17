import express from "express";
import User from "../models/user.model.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

// get all users (needed for chat names)
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// get single user
router.get("/:id", getUser);

export default router;
