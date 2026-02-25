import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.isBanned) {
      return res
        .status(403)
        .json({ message: "Your account is banned. Contact admin." });
    }

    
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) {
      return res.status(400).json({ message: "Wrong password" });
    }


    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    const { password, ...info } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, 
        path: "/",     
      })
      .status(200)
      .json(info);
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    })
    .status(200)
    .json({ message: "Logged out" });
};