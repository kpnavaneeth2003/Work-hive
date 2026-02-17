import mongoose from "mongoose";
import Category from "./models/category.model.js";

const categories = [
  { name: "Plumbing" },
  { name: "Electrician" },
  { name: "Carpentry" },
  { name: "AC Repair" },
  { name: "Painting" },
  { name: "Cleaning" },
  { name: "Gardening" },
];

async function seed() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/helios");

    await Category.deleteMany(); // remove if you want duplicates removed

    await Category.insertMany(categories);

    console.log("✅ Categories added!");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seed();
