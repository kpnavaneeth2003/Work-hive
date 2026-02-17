import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import notificationRoute from "./routes/notification.route.js";
import categoryRoute from "./routes/category.route.js";

const app = express();
mongoose.set("strictQuery", true);

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/categories", categoryRoute);

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({ message });
});


const PORT = process.env.PORT || 8800;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection failed:", err));


