import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getAdminStats,
  listUsers,
  toggleBanUser,
  listGigs,
  deleteGigByAdmin,
  listOrders,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getAdminStats);

router.get("/users", verifyToken, isAdmin, listUsers);
router.patch("/users/:id/ban", verifyToken, isAdmin, toggleBanUser);

router.get("/gigs", verifyToken, isAdmin, listGigs);
router.delete("/gigs/:id", verifyToken, isAdmin, deleteGigByAdmin);

router.get("/orders", verifyToken, isAdmin, listOrders);

export default router;