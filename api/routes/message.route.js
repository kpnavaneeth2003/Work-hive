import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createMessage,
  getMessages,
  getUnreadCount,
  markConversationRead,
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", verifyToken, createMessage);


router.get("/unread/count", verifyToken, getUnreadCount);
router.put("/read/:id", verifyToken, markConversationRead);

router.get("/:conversationId", verifyToken, getMessages);

export default router;