import { GraphqlQueryError } from "@shopify/shopify-api";

import shopifyClient from "../helper/shopify-client.js";
import { QUERY_PRODUCTS_LIMIT } from "../helper/gql.js";
import {
  getOfferByPid,
  getShopifyOptionsToOfferOptions,
  getOfferOptionsByOfferId
} from "../helper/offer.js";
import { getProductByPid } from "../helper/product.js";

export default function applyProductsApiEndpoints(app) {
  app.get("/api/product/list", async (req, res) => {
    try {
      /* Fetch all available discounts to list in the QR code form */
      const { title, page, limit = 10 } = req.query;

      const variables = {
        first: parseInt(limit),
        after: page ? page : null,
        title: `title:${title}*`,
      };

      const data = await shopifyClient(res, QUERY_PRODUCTS_LIMIT, variables);

      res.send(data.body.data);
    } catch (error) {
      // Handle errors thrown by the graphql client
      if (!(error instanceof GraphqlQueryError)) {
        throw error;
      }
      return res.status(500).send({ error: error.response });
    }
  });

  app.get("/api/product/:id", async (req, res) => {
    const offerProduct = await getOfferByPid(req, res);

    const shopifyProduct = await getProductByPid(req, res);
    // const shopifyProduct = await getOfferOptionsByOfferId(
    //   req,
    //   res,
    //   offerProduct._id
    // );

    const data = {};

    if (offerProduct) {
      data.heading = offerProduct.heading;
      data.id = offerProduct._id;
    } else {
      res.status(500).send("error");
    }
    if (shopifyProduct) {
      if (shopifyProduct.hasOnlyDefaultVariant) {
        data.list = null;
      } else {
        data.list = getShopifyOptionsToOfferOptions(shopifyProduct);
      }
      data.title = shopifyProduct.title;
    } else {
      res.status(500).send("error");
    }
    res.status(200).send(data);
  });
}
