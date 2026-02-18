import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Create message
export const createMessage = async (req, res) => {
  try {
    const { conversationId, desc, location } = req.body;

    const newMessage = new Message({
      conversationId,
      userId: req.userId,            // from verifyToken middleware
      ...(desc && { desc }),          // only add desc if provided
      ...(location && { location }),  // only add location if provided
    });

    const savedMessage = await newMessage.save();

    // ✅ Update conversation read flags for unread dot
    const conversation = await Conversation.findOne({ id: conversationId });
    if (conversation) {
      if (req.isSeller) {
        conversation.readByBuyer = false;  // other party has unread
      } else {
        conversation.readBySeller = false; // other party has unread
      }
      await conversation.save();
    }

    res.status(201).json(savedMessage);
  } catch (err) {
    console.log("Create Message Error:", err);
    res.status(500).json(err);
  }
};

// Get messages by conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
