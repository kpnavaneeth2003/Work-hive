import User from "../models/user.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";


const attachUserInfo = async (docs, fields) => {
  const ids = new Set();

  docs.forEach((d) => {
    fields.forEach((f) => {
      if (d[f]) ids.add(String(d[f]));
    });
  });

  const users = await User.find({ _id: { $in: [...ids] } }).select(
    "_id username email"
  );
  const map = new Map(users.map((u) => [String(u._id), u]));

  return docs.map((d) => {
    const obj = d.toObject();
    fields.forEach((f) => {
      const u = map.get(String(obj[f]));
      obj[`${f}User`] = u ? { _id: u._id, username: u.username, email: u.email } : null;
    });
    return obj;
  });
};


export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalSellers, totalGigs, totalOrders, completedOrders] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ isSeller: true }),
        Gig.countDocuments({}),
        Order.countDocuments({}),
        Order.countDocuments({ isCompleted: true }),
      ]);

    const revenueAgg = await Order.aggregate([
      { $match: { isCompleted: true } },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalRevenue = revenueAgg?.[0]?.total || 0;

    res.json({
      totalUsers,
      totalSellers,
      totalGigs,
      totalOrders,
      completedOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json("Failed to load stats");
  }
};


export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json("Failed to load users");
  }
};


export const toggleBanUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select("isBanned role");
    if (!u) return res.status(404).json("User not found");

    if (u.role === "admin") return res.status(403).json("Cannot ban admin");

    u.isBanned = !u.isBanned;
    await u.save();

    res.json({ _id: u._id, isBanned: u.isBanned });
  } catch (err) {
    res.status(500).json("Failed to update user");
  }
};


export const listGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({}).sort({ createdAt: -1 });
    const withSeller = await attachUserInfo(gigs, ["userId"]); 
    res.json(withSeller);
  } catch (err) {
    res.status(500).json("Failed to load gigs");
  }
};


export const deleteGigByAdmin = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json("Gig not found");

    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json("Failed to delete gig");
  }
};


export const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });


    const withUsers = await attachUserInfo(orders, ["buyerId", "sellerId"]);
    res.json(withUsers);
  } catch (err) {
    res.status(500).json("Failed to load orders");
  }
};