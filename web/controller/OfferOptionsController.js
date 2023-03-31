import { OfferOptions } from "../db/db.js";
import paginate from "./paginate.js";

class OfferOptionsController {
  static async createOfferOptions(OfferOptionsData) {
    try {
      const newOfferOptions = new OfferOptions(OfferOptionsData);
      await newOfferOptions.save();
      return newOfferOptions;
    } catch (error) {
      console.error("Error creating OfferOptions:", error);
      throw error;
    }
  }

  static async insertOfferOptions(OfferOptionsData) {
    try {
      const newOfferOptions = OfferOptions.insertMany(OfferOptionsData);
      await newOfferOptions;
      return newOfferOptions;
    } catch (error) {
      console.error("Error creating OfferOptions:", error);
      throw error;
    }
  }

  static async getOfferOptionsById(id) {
    try {
      const info = await OfferOptions.findById(id);
      return info;
    } catch (error) {
      console.error("Error getting Offe by email:", error);
      throw error;
    }
  }

  static async getOfferOptionsByParams(params) {
    try {
      const info = await OfferOptions.find(params);
      return info;
    } catch (error) {
      console.error("Error getting Offe by params:", error);
      throw error;
    }
  }

  static async updateOfferOptions(OfferOptionsId, updates) {
    try {
      const info = await OfferOptions.findByIdAndUpdate(
        OfferOptionsId,
        updates,
        {
          new: true,
        }
      );
      return info;
    } catch (error) {
      console.error("Error updating Offe:", error);
      throw error;
    }
  }

  static async deleteOfferOptions(OfferOptionsId) {
    try {
      await OfferOptions.findByIdAndDelete(OfferOptionsId);
    } catch (error) {
      console.error("Error deleting Offe:", error);
      throw error;
    }
  }
  static async getPage(query, options) {
    try {
      const result = await paginate(OfferOptions, query, options);
      return result;
    } catch (error) {
      console.error("Error getPage Offe:", error);
      throw error;
    }
  }
  static async getOfferIdByvariantId(offerId) {
    try {
      const result = await OfferOptions.find(offerId).populate("offerId");
      return result;
    } catch (error) {
      console.error("Error getOfferIdByvariantId Offe:", error);
      throw error;
    }
  }
  static async updateOfferOptionsForofferId(offerId, data) {
    try {
      let count = 0;
      for (const product of data) {
        const { selectedOptions, ...obj } = product;

        const result = await OfferOptions.updateOne(
          { variantId: product.variantId },
          { $set: obj, $push: selectedOptions }
        );
        console.log(result);
        // if (result.variantId) {
        //   count++;
        // }
      }
      return count;
    } catch (error) {
      console.error("Error getOfferIdByvariantId Offe:", error);
      throw error;
    }
  }
}

export default OfferOptionsController;
