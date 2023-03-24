import shopify from "../shopify.js";
import { GraphqlQueryError } from "@shopify/shopify-api";
import { QUERY_PRODUCTS_LIMIT } from "../helper/gql.js";

import { getOfferByPid, getProductByPid } from "../helper/offer.js";

export default function applyProductsApiEndpoints(app) {
  app.get("/api/product/list", async (req, res) => {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });
    try {
      /* Fetch all available discounts to list in the QR code form */
      const { title, after, limit = 10 } = req.query;

      const variables = {
        first: parseInt(limit),
        after: after ? after : null,
        title: `title:${title}*`,
      };
      const data = await client.query({
        data: {
          query: QUERY_PRODUCTS_LIMIT,
          variables,
        },
      });

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
    const data = {};

    if (offerProduct) {
      data.heading = offerProduct.heading;
    }
    if (shopifyProduct) {
      if (shopifyProduct.hasOnlyDefaultVariant) {
        data.list = null;
      } else {
        const nodeList = shopifyProduct.variants.edges.map((item) => {
          const no = item.node;
          delete no.title;
          return no;
        });
        const optionNames = [];

        shopifyProduct.options.map((item) => {
          optionNames.push(item.name);
        });

        data.list = Array.from(
          nodeList
            .reduce((acc, curr) => {
              const sizeOption = curr.selectedOptions.find((option) =>
                optionNames.includes(option.name)
              );
              const title = sizeOption ? sizeOption.value : "Default Title";
              const item = acc.get(title) || {
                title,
                price: curr.price,
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
      }
      data.title = shopifyProduct.title;
    }
    res.status(200).send(data);
  });
}
