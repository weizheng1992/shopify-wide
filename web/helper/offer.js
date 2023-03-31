import OfferController from "../controller/OfferController.js";
import OfferOptionsController from "../controller/OfferOptionsController.js";

export async function getShopUrlFromSession(req, res) {
  return `https://${res.locals.shopify.session.shop}`;
}

export async function getOfferByPid(req, res, checkDomain = true) {
  try {
    const offer = await OfferController.getOfferByParams({
      productId: req.params.id,
    });
    if (!Array.isArray(offer) || offer?.length !== 1) return undefined;
    const data = offer[0];
    if (
      data === undefined ||
      (checkDomain &&
        (await getShopUrlFromSession(req, res)) !== data.shopDomain)
    ) {
      res.status(404).send();
    }
    return data;
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getOfferOptionsByOfferId(req, res, OfferId) {
  try {
    const offer = await OfferOptionsController.getOfferOptionsByParams({
      OfferId,
    });
    if (!Array.isArray(offer) || offer?.length !== 1) return undefined;

    return data;
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// const data= [
//   {
//     "title":"S4",
//     "price":"4.00",
//     "list":[
//       {"optionsName":"Color","optionsTags":["red","yellow"]},
//       {"optionsName":"Style","optionsTags":["ss","ddd"]}
//     ]
//   },
//   {
//     "title":"M",
//     "price":"5.00",
//     "list":[
//       {"optionsName":"Color","optionsTags":["red","yellow"]},
//       {"optionsName":"Style","optionsTags":["ss","ddd"]}
//     ]
//   }
// ];

// [
//   { price: '4.00', options: [ 'S4', 'red', 'ss' ] },
//   { price: '4.00', options: [ 'S4', 'red', 'ddd' ] },
//   { price: '4.00', options: [ 'S4', 'yellow', 'ss' ] },
//   { price: '4.00', options: [ 'S4', 'yellow', 'ddd' ] },
//   { price: '5.00', options: [ 'M', 'red', 'ss' ] },
//   { price: '5.00', options: [ 'M', 'red', 'ddd' ] },
//   { price: '5.00', options: [ 'M', 'yellow', 'ss' ] },
//   { price: '5.00', options: [ 'M', 'yellow', 'ddd' ] }
// ]
/**
 * @description shopify返回的options格式转换成offer options格式
 *
 * @param {*} shopifyProduct
 * @return {*}
 */
export const getShopifyOptionsToOfferOptions = (shopifyProduct) => {
  const nodeList = shopifyProduct.variants.edges.map((item) => {
    const no = item.node;
    delete no.title;
    return no;
  });
  const optionNames = [];

  shopifyProduct.options.map((item) => {
    optionNames.push(item.name);
  });

  const data = Array.from(
    nodeList
      .reduce((acc, curr) => {
        const sizeOption = curr.selectedOptions.find((option) =>
          optionNames.includes(option.name)
        );
        const title = sizeOption ? sizeOption.value : "Default Title";
        const item = acc.get(title) || {
          title,
          price: curr.price,
          compareAtPrice: curr.compareAtPrice,
          list: [],
        };
        curr.selectedOptions
          .filter((option) => option.name !== optionNames[0])
          .forEach((option) => {
            const optionValues = item.list.find(
              (opt) => opt.optionsName === option.name
            ) || {
              optionsName: option.name,
              optionsTags: [],
            };
            if (!optionValues.optionsTags.includes(option.value)) {
              optionValues.optionsTags.push(option.value);
            }
            if (!item.list.includes(optionValues)) {
              item.list.push(optionValues);
            }
          });
        acc.set(title, item);
        return acc;
      }, new Map())
      .values()
  );

  return data;
};

export const insertOfferOptions = async (data, _id, isUpdate) => {
  const nodes = data.body.data.productUpdate.product.variants.edges;
  const nodeAddId = nodes.map((item) => {
    const { id, ...obj } = item.node;
    return {
      ...obj,
      offerId: _id,
      variantId: id.split("/").pop(),
    };
  });
  let list = null;
  if (isUpdate) {
    list = await OfferOptionsController.updateOfferOptionsForofferId(
      _id,
      nodeAddId
    );
  } else {
    list = await OfferOptionsController.insertOfferOptions(nodeAddId);
  }
  return list;
};
