import paginate from "./paginate.js";
class BaseController {
  constructor(model) {
    this.Model = model;
  }

  async create(data) {
    try {
      const newItem = this.Model(data);
      await newItem.save();
      return newItem;
    } catch (error) {
      console.error(`Error creating item: ${error}`);
      throw error;
    }
  }

  async getById(id) {
    try {
      const item = await this.Model.findById(id);
      return item;
    } catch (error) {
      console.error(`Error getting item by id: ${error}`);
      throw error;
    }
  }

  async getByParams(params) {
    try {
      const items = await this.Model.find(params);
      return items;
    } catch (error) {
      console.error(`Error getting items by params: ${error}`);
      throw error;
    }
  }

  async updateById(id, updates) {
    try {
      const item = await this.Model.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return item;
    } catch (error) {
      console.error(`Error updating item by id: ${error}`);
      throw error;
    }
  }

  async deleteById(id) {
    try {
      await this.Model.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting item by id: ${error}`);
      throw error;
    }
  }

  async getPage(query, options) {
    try {
      const result = await paginate(this.Model, query, options);
      return result;
    } catch (error) {
      console.error(`Error getting items by page: ${error}`);
      throw error;
    }
  }
}

export default BaseController;
