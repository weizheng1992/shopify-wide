import { Offer } from "../db/db.js";

class OfferController {
  static async createOffer(offerData) {
    try {
      const newOffer = new Offer(offerData);
      await newOffer.save();
      return newOffer;
    } catch (error) {
      console.error("Error creating offer:", error);
      throw error;
    }
  }

  static async getOfferById(id) {
    try {
      const offer = await Offer.findById(id);
      return offer;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  static async getOfferByParams(params) {
    try {
      const offer = await Offer.find(params);
      return offer;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw error;
    }
  }

  static async updateOffer(offerId, updates) {
    try {
      const offer = await Offer.findByIdAndUpdate(offerId, updates, {
        new: true,
      });
      return offer;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  static async deleteOffer(offerId) {
    try {
      await Offer.findByIdAndDelete(offerId);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}

export default OfferController;
