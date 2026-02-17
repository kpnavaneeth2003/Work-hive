import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).json("User has been created.");
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong username or password!"));

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;

    // Cookie for localhost
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .status(200)
      .json(info);
  } catch (err) {
    next(err);
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "lax",
      secure: false,
    })
    .status(200)
    .json("User has been logged out.");
};
