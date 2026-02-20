import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated");

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return res.status(403).json("Token invalid");

    try {
      // ✅ BAN CHECK on every protected request
      const user = await User.findById(payload.id).select("isBanned");
      if (!user) return res.status(401).json("User not found");

      if (user.isBanned) {
        return res.status(403).json("Account banned");
      }

      req.userId = payload.id;
      req.isSeller = payload.isSeller;
      req.role = payload.role; // optional
      next();
    } catch (e) {
      return res.status(500).json("Server error");
    }
  });
};