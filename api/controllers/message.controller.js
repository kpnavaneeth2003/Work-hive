import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";


export const createMessage = async (req, res) => {
  try {
    const { conversationId, desc, location } = req.body;

    const newMessage = new Message({
      conversationId,
      userId: req.userId,            
      ...(desc && { desc }),          
      ...(location && { location }),  
    });

    const savedMessage = await newMessage.save();

    
    const conversation = await Conversation.findOne({ id: conversationId });
    if (conversation) {
      if (req.isSeller) {
        conversation.readByBuyer = false;  
      } else {
        conversation.readBySeller = false; 
      }
      await conversation.save();
    }

    res.status(201).json(savedMessage);
  } catch (err) {
    console.log("Create Message Error:", err);
    res.status(500).json(err);
  }
};


export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getUnreadCount = async (req, res) => {
  try {
    const filter = req.isSeller
      ? { sellerId: req.userId, readBySeller: false }
      : { buyerId: req.userId, readByBuyer: false };

    const count = await Conversation.countDocuments(filter);
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: "Unread count error" });
  }
};

export const markConversationRead = async (req, res) => {
  try {
    const conv = await Conversation.findOne({ id: req.params.id });
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    if (conv.sellerId !== req.userId && conv.buyerId !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.isSeller) conv.readBySeller = true;
    else conv.readByBuyer = true;

    await conv.save();
    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Mark read error" });
  }
};
