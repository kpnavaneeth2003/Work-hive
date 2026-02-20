import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String },
    country: { type: String, required: true },
    phone: { type: String },
    desc: { type: String },

    // existing seller field
    isSeller: { type: Boolean, default: false },

    // ✅ new role field (admin support)
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    // ✅ ban control
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);