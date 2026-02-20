import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

export const createOrder = async (req, res, next) => {
  try {
    const { gigId, payment_intent } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) return next(createError(404, "Gig not found"));

    const existing = await Order.findOne({ payment_intent });
    if (existing) return res.status(200).json(existing);

    const newOrder = new Order({
      gigId: gig._id.toString(),
      img: gig.cover || "",
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent,
      isCompleted: true,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const filter = req.isSeller
      ? { sellerId: req.userId }
      : { buyerId: req.userId };

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};