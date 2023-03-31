import mongoose from "mongoose";

const productOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const offerOptionsSchema = new mongoose.Schema({
  variantId: { type: String, required: true },
  price: { type: String, required: true },
  selectedOptions: { type: [productOptionSchema], required: true },
  compareAtPrice: { type: String },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'offer' },
});

export default offerOptionsSchema;
