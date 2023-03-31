import mongoose from "mongoose";
import offerSchema from "./offer.js";
import offerOptionsSchema from "./offer-options.js";
import { MONGODB_URI, DATABASE } from "./db-url.js";

// Connect to MongoDB

// Create the 'Offer' model
const Offer = mongoose.model("offer", offerSchema);
const OfferOptions = mongoose.model("offer-options", offerOptionsSchema);

mongoose.connect(MONGODB_URI + DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export { Offer, OfferOptions };
