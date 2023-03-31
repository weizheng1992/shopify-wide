import OfferController from "../controller/OfferController.js";
import OfferOptionsController from "../controller/OfferOptionsController.js";
import { getShopifyOptionsToOfferOptions } from "../helper/offer.js";

export default function offerWebApi(app) {
  app.get("/web/offer/:id", async (req, res) => {
    const vId = req.params.id;

    // 根据 variantId 查询 OfferOPtions 数据

    const product = await OfferController.getOfferByParams({
      productId: "gid://shopify/Product/" + vId,
    });

    if (!product) {
      console.log("未查询到符合条件的数据");
      return;
    }

    const offerId = product[0]._id;

    const products = await OfferOptionsController.getOfferOptionsByParams({
      offerId,
    });

    const result = [];
    products.map((item) => {
      const obj = {
        variantId: item.variantId,
        heading: product.heading,
        price: item.price,
        compareAtPrice: item.compareAtPrice,
        options: [],
      };
      item.selectedOptions.map((item) => {
        obj.options.push(item.value);
      });
      result.push(obj);
    });

    const weblist = processData(result);

    res.status(200).send({ list: result, weblist, offer: product[0] });
  });
}

function processData(input) {
  const output = {};

  input.forEach((item) => {
    const { price, options, variantId } = item;

    if (!output[price]) {
      output[price] = {
        price: price,
        title: options[0],
        id: variantId,
        options: [],
      };
    }

    options.slice(1).forEach((option, index) => {
      if (!output[price].options[index]) {
        output[price].options[index] = {
          name: "",
          values: [],
        };
      }

      if (!output[price].options[index].values.includes(option)) {
        output[price].options[index].values.push(option);
      }
    });
  });

  return Object.values(output);
}
