import {
  MUTATION_PRODUCT_UPDATE,
  QUERY_PRODUCT_OFFER_VARIANTS,
  QUERY_COLLECTION,
} from "./gql.js";

import shopifyClient from "./shopify-client.js";
/**
 * @description 更新产品的variants
 *
 * @param {*} productId
 * @param {*} variants
 * @return {*}
 */
export const updateProduct = async (res, productId, variants) => {
  const variables = {
    input: {
      id: productId,
    },
  };
  const options = ["default"];
  // const result = [];
  if (variants.length > 0) {
    // 数据改为variants格式
    variables.input.variants = getCombinations(variants);
    //  获取option
    // variables.input.options = ["Size", "Color"];
    variants[0].list.forEach((listItem) => {
      if (!options.includes(listItem.optionsName)) {
        options.push(listItem.optionsName);
      }
    });
  }

  variables.input.options = options;

  const data = await shopifyClient(res, MUTATION_PRODUCT_UPDATE, variables);

  return { data, options };
};

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

export async function getProductByPid(req, res) {
  const productId = req.params.id;
  if (productId) {
    const adminData = await shopifyClient(res, QUERY_PRODUCT_OFFER_VARIANTS, {
      productId,
    });

    const shopifyProduct = adminData.body.data.product;
    return shopifyProduct;
  }
  return undefined;
}

export async function getCollectionByPid(req, res) {
  const productId = req.params.id;
  if (productId) {
    const adminData = await shopifyClient(res, QUERY_COLLECTION, {
      productId,
    });
  }
  return adminData;
}
