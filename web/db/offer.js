import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  shopDomain: String,
  variantId: String,
  heading: String,
  productId: String,
});

export default offerSchema;
