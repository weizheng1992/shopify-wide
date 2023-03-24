import shopify from "../shopify.js";

import OfferController from "../controller/OfferController.js";

import { MUTATION_PRODUCT_UPDATE, QUERY_PRODCUT_INFO } from "../helper/gql.js";
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
      const data = await client.query({
        data: {
          query: MUTATION_PRODUCT_UPDATE,
          variables,
        },
      });

      const offerData = {
        shopDomain: await getShopUrlFromSession(req, res),
        productId: req.body.productId,
        heading: heading,
      };
      const offer = await OfferController.createOffer(offerData);
      if (data && offer) {
        res.status(201).json(offer);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the offer." });
    }
  });

  app.post("/api/offer/list", async (req, res) => {
    try {
      const { query, options } = req.body;
      const params = {};
      const admin = await getShopUrlFromSession(req, res);
      if (query) {
        params = { ...query, shopDomain: admin };
      } else {
        params.shopDomain = admin;
      }
      const res = await OfferController.getPage(params, options);

      const client = new shopify.api.clients.Graphql({
        session: res.locals.shopify.session,
      });

      const { data } = res;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const pro = await client.query({
          data: {
            query: MUTATION_PRODUCT_UPDATE,
            variables: { productId: element.productId },
          },
        });
        element.title = pro.title;
      }
      res.status(200).json(res);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while list the offer." });
    }
  });
}
