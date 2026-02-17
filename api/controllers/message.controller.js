import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// SEND MESSAGE
export const createMessage = async (req, res, next) => {
  try {
    const newMessage = new Message({
      conversationId: req.body.conversationId, // seller_buyer
      userId: req.userId,
      desc: req.body.desc,
    });

    const savedMessage = await newMessage.save();

    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        lastMessage: req.body.desc,
        ...(req.isSeller
          ? { readBySeller: true, readByBuyer: false }
          : { readBySeller: false, readByBuyer: true }),
      }
    );

    res.status(201).json(savedMessage);
  } catch (err) {
    next(err);
  }
};


// GET MESSAGES
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};
