import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    conversationId: String,
    userId: String,
    desc: String, 
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
