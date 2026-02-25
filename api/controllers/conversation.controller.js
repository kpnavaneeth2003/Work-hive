import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js"; 


export const createConversation = async (req, res, next) => {
  try {
    const { to } = req.body;

    const sellerId = req.isSeller ? req.userId : to;
    const buyerId = req.isSeller ? to : req.userId;

    if (sellerId === buyerId) {
      return res.status(400).send("You cannot message yourself.");
    }

    const conversationId = sellerId + "_" + buyerId;

    const existingConversation = await Conversation.findOne({
      id: conversationId,
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const newConversation = new Conversation({
      id: conversationId,
      sellerId,
      buyerId,
      readBySeller: true,
      readByBuyer: true,
    });

    const savedConversation = await newConversation.save();

    res.status(201).json(savedConversation);
  } catch (err) {
    console.log("Conversation Error:", err);
    next(err);
  }
};


export const getConversations = async (req, res, next) => {
  try {
    const convos = await Conversation.find(
      req.isSeller
        ? { sellerId: req.userId }
        : { buyerId: req.userId }
    ).sort({ updatedAt: -1 });

    
    const conversationsWithUser = await Promise.all(
      convos.map(async (c) => {
        const otherUserId = req.isSeller ? c.buyerId : c.sellerId;

        const user = await User.findById(otherUserId).select(
          "username img"
        );

        
        const lastMessageObj = await Message.findOne({
          conversationId: c.id,
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          ...c._doc,
          user, 
          lastMessageObj, 
          lastMessage: lastMessageObj?.desc || "", 
        };
      })
    );

    res.status(200).json(conversationsWithUser);
  } catch (err) {
    next(err);
  }
};


export const getSingleConversation = async (req, res, next) => {
  try {
    const convo = await Conversation.findOne({ id: req.params.id });
    res.status(200).json(convo);
  } catch (err) {
    next(err);
  }
};


export const markAsRead = async (req, res, next) => {
  try {
    await Conversation.findOneAndUpdate(
      { id: req.params.id },
      req.isSeller
        ? { readBySeller: true }
        : { readByBuyer: true }
    );

    res.status(200).send("Conversation marked as read");
  } catch (err) {
    next(err);
  }
};
