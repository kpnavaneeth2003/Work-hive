import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import adminRoute from "./routes/admin.route.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import notificationRoute from "./routes/notification.route.js";
import categoryRoute from "./routes/category.route.js";
import searchRoute from "./routes/search.route.js";
import locationRoute from "./routes/location.route.js";

const app = express();
mongoose.set("strictQuery", true);

const PORT = process.env.PORT || 8800;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/search", searchRoute);
app.use("/api/location", locationRoute);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({ message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection failed:", err));