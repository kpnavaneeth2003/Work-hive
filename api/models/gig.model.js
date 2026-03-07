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
        "Gardening",
        "Bathroom renovators",
        "Air Conditioning services",
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

    // Location fields
    city: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    area: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

GigSchema.index({ location: "2dsphere" });

export default mongoose.model("Gig", GigSchema);