import User from "../models/user.model.js";


export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("_id username img");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
