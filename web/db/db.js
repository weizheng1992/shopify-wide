import mongoose from "mongoose";
import offerSchema from "./offer.js";
import { MONGODB_URI, DATABASE } from "./db-url.js";

// Connect to MongoDB
mongoose.connect(MONGODB_URI + DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create the 'Offer' model
const Offer = mongoose.model("offer", offerSchema);

export { Offer };
