import Notification from "../models/Notification.model.js";

export const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};
