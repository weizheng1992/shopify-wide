import shopify from "../shopify.js";

import OfferController from "../controller/OfferController.js";

import {
  CREATE_PRODUCT_VARIANT_MUTATION,
  PRODUCT_UPDATE_MUTATION,
} from "../helper/gql.js";
import { getShopUrlFromSession, getCombinations } from "../helper/offer.js";

export default function applyOfferApiEndpoints(app) {
  app.post("/api/offer/create", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });
    try {
      const { productId, variants, heading } = req.body;
      const variables = {
        input: {
          id: productId,
        },
      };
      const options = ["default"];
      const result = [];
      if (variants.length > 0) {
        variants.forEach((item) => {
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

        ///  获取option
        variants[0].list.forEach((listItem) => {
          if (!options.includes(listItem.optionsName)) {
            options.push(listItem.optionsName);
          }
        });
      }

      variables.input.options = options;
      variables.input.variants = result;

      //  variables = {

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
      // variables.input.options = ["Size", "Color"];
      //     options: [req.body.title],
      //     variants: [
      //       {
      //         price: req.body.price,
      //         options: [req.body.title],
      //         compareAtPrice:req.body.compareAtPrice
      //       },
      //     ],
      //   },
      // };
      const data = await client.query({
        data: {
          // query: CREATE_PRODUCT_VARIANT_MUTATION,
          query: PRODUCT_UPDATE_MUTATION,
          variables,
        },
      });

      const offerData = {
        shopDomain: await getShopUrlFromSession(req, res),
        productId: req.body.productId,
        // variantId: data.body.data.productVariantCreate.productVariant.id,
        heading: heading,
      };
      const offer = await OfferController.createOffer(offerData);
      if (data && offer) {
        res.status(201).json(offer);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user." });
    }
  });
}
