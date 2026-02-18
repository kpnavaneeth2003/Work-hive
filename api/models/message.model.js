import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: String,
    userId: String,
    desc: String, // optional for location messages
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
