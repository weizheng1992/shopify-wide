import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  shopDomain: { type: String, required: true },
  variantId: { type: String, required: true },
  heading: { type: String },
  productId: { type: String, required: true },
  thumbnail: { type: String },
  options: { type: [String], required: true },
});

export default offerSchema;
