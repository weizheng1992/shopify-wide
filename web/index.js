// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cors from 'cors'
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import applyOfferApiEndpoints from "./middleware/offer-api.js";
import applyProductsApiEndpoints from "./middleware/product-api.js";
import offerWebApi from "./middleware/offer-web-api.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.use(cors());
// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
offerWebApi(app);
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

applyOfferApiEndpoints(app);
applyProductsApiEndpoints(app);
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});
console.log('PORT',PORT)
app.listen(PORT);
