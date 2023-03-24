import shopify from "../shopify.js";
import OfferController from "../controller/OfferController.js";
import { QUERY_PRODUCT_OFFER_VARIANTS } from "../helper/gql.js";

export async function getShopUrlFromSession(req, res) {
  return `https://${res.locals.shopify.session.shop}`;
}

export async function getOfferByPid(req, res, checkDomain = true) {
  try {
    const offer = await OfferController.getOfferByParams({
      productId: req.params.id,
    });
    if (!Array.isArray(offer) || offer?.length !== 1) return undefined;
    return offer[0];
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getProductByPid(req, res) {
  if (req.params.id) {
    const productId = req.params.id;
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });
    try {
      const adminData = await client.query({
        data: {
          query: QUERY_PRODUCT_OFFER_VARIANTS,

          /* The IDs that are pulled from the app's database are used to query product, variant and discount information */
          variables: { productId },
        },
      });

      const shopifyProduct = adminData.body.data.product;
      return shopifyProduct;
    } catch (error) {
      return undefined;
    }
  }
  return undefined;
}

// variables.input.variants = [
//   {
//     price: "4.00",
//     options: ["big", "mauve"],
//   },
//   {
//     price: "2.00",
//     options: ["big", "iridescent"],
//   },
//   {
//     price: "5.00",
//     options: ["small", "mauve"],
//   },
//   {
//     price: "1.00",
//     options: ["small", "iridescent"],
//   },
// ];

/**
 * @description 将数据转换成上面的格式
 *
 * @param {*} data
 * @return {*}
 */
export const getCombinations = (data) => {
  const result = [];
  data.forEach((item) => {
    const { price } = item;

    const generateOptions = (index, options) => {
      const list = item.list[index];
      if (!list) {
        const optionList = [item.title];
        Object.values(options).forEach((option) => {
          optionList.push(option);
        });
        result.push({ price, options: optionList });
        return;
      }
      const { optionsName, optionsTags: tags } = list;
      tags.forEach((tag) => {
        generateOptions(index + 1, { ...options, [optionsName]: tag });
      });
    };

    generateOptions(0, {});
  });
  return result;
};
