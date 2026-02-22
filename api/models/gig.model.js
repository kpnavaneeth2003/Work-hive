import mongoose from "mongoose";
const { Schema } = mongoose;

const GigSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    totalStars: {
      type: Number,
      default: 0,
    },
    starNumber: {
      type: Number,
      default: 0,
    },
    cat: {
      type: String,
      enum: [
        "Plumbing",
        "Electrician",
        "Carpentry",
        "Landscaping",
        "Cleaning",
        "Air Conditioning",
        "Bathroom renovators",
        "Air conditioning services",
        "Painting",
        "Arborist",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
    },
    images: {
      type: [String],
    },
    shortTitle: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      required: true,
    },

    // ⭐ revision removed (or optional with default)
    revisionNumber: {
      type: Number,
      default: 0,
    },

    features: {
      type: [String],
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gig", GigSchema);