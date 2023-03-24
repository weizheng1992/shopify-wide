import shopify from "../shopify.js";
import OfferController from "../controller/OfferController.js";
import {
  PRODUCT_VARIANT_QUERY,
  PRODUCT_OFFER_ADMIN_QUERY,
} from "../helper/gql.js";

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
          query: PRODUCT_OFFER_ADMIN_QUERY,

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

const generateOptions = (data) => {
  const options = ["default"];
  for (const item of data) {
    options.push(item.title);
    for (const list of item.list) {
      if (!options.includes(list.optionsName)) {
        options.push(list.optionsName);
      }
    }
  }
  return options;
};

export const getCombinations = (data) => {
  const options = generateOptions(data);
  const variations = [];
  const base = new Array(options.length).fill("default");

  for (const item of data) {
    const price = item.price;
    const titleIndex = options.indexOf(item.title);
    const { list } = item;
    const listIndexes = list.map((item) => options.indexOf(item.optionsName));

    for (let i = 0; i < list[0].optionsTags.length; i++) {
      const combination = [...base];
      combination[titleIndex] = item.title;
      for (let j = 0; j < listIndexes.length; j++) {
        const optionIndex = listIndexes[j];
        const optionValue = list[j].optionsTags[i];
        combination[optionIndex] = optionValue;
      }
      variations.push({ price, options: combination });
    }
  }

  return variations;
};
