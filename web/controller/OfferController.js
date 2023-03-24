import { Offer } from "../db/db.js";
import paginate from "./paginate.js";

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
      console.error("Error getting Offe by email:", error);
      throw error;
    }
  }

  static async getOfferByParams(params) {
    try {
      const offer = await Offer.find(params);
      return offer;
    } catch (error) {
      console.error("Error getting Offe by params:", error);
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
      console.error("Error updating Offe:", error);
      throw error;
    }
  }

  static async deleteOffer(offerId) {
    try {
      await Offer.findByIdAndDelete(offerId);
    } catch (error) {
      console.error("Error deleting Offe:", error);
      throw error;
    }
  }
  static async getPage(query, options) {
    try {
      const result = await paginate(Offer, query, options);
      return result;
    } catch (error) {
      console.error("Error getPage Offe:", error);
      throw error;
    }
  }
}

export default OfferController;
