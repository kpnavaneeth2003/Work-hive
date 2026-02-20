import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const me = await User.findById(req.userId).select("role isBanned");
    if (!me) return res.status(401).json("User not found");
    if (me.isBanned) return res.status(403).json("Account banned");

    if (me.role !== "admin") return res.status(403).json("Admin only");
    next();
  } catch (err) {
    res.status(500).json("Admin check failed");
  }
};