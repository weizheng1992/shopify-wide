import shopify from "../shopify.js";

import OfferController from "../controller/OfferController.js";

import { QUERY_PRODCUT_INFO } from "../helper/gql.js";
import { getShopUrlFromSession, insertOfferOptions } from "../helper/offer.js";
import { updateProduct } from "../helper/product.js";

export default function applyOfferApiEndpoints(app) {
  app.post("/api/offer/create", async (req, res) => {
    try {
      const { productId, variants, heading, feature } = req.body;
      const { data, options } = updateProduct(res, productId, variants);
      const offerData = {
        shopDomain: await getShopUrlFromSession(req, res),
        productId: req.body.productId.split("/").pop(),
        heading: heading,
        options: options,
      };
      const offer = await OfferController.createOffer(offerData);
      const list = insertOfferOptions(data, offer._id);
      if (list) {
        res.status(201).json(offer);
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the offer." });
    }
  });

  app.patch("/api/offer/:id", async (req, res) => {
    const _id = req.params.id;
    const offer = await OfferController.getOfferById(_id);
    if (offer) {
      try {
        const { productId, variants, heading, feature } = req.body;
        const { data, options } = await updateProduct(res, productId, variants);
        if (data) {
          const updateOffer = await OfferController.updateOffer(_id, {
            heading,
            options,
          });

          const list = await insertOfferOptions(data, _id, true);
          if (list) {
            res.status(200).send({
              updateOffer,
              data: data.body.data.productUpdate.product,
            });
          }
        }
      } catch (error) {
        res.status(500).json(error.message);
      }
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
      const result = await OfferController.getPage(params, options);

      const client = new shopify.api.clients.Graphql({
        session: res.locals.shopify.session,
      });

      const {
        data,
        currentPage,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      } = result;

      const list = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const pro = await client.query({
          data: {
            query: QUERY_PRODCUT_INFO,
            variables: {
              productId: element.productId,
            },
          },
        });
        list.push({ ...element, title: pro.body.data.product.title });
      }

      res.status(200).json({
        list,
        currentPage,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while list the offer." });
    }
  });
}
