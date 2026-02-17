import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";


// ✅ CREATE ORDER (Dummy Payment)
export const createOrder = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.body.gigId);

    if (!gig) return next(createError(404, "Gig not found"));

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: "dummy_" + Date.now(), // fake transaction id
      isCompleted: true, // payment instantly successful
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);

  } catch (err) {
    next(err);
  }
};



// ✅ GET USER ORDERS
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller
        ? { sellerId: req.userId }
        : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).json(orders);

  } catch (err) {
    next(err);
  }
};
