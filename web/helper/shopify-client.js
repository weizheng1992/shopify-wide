import shopify from "../shopify.js";

export default async function shopifyClient(res, query, variables) {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  try {
    const adminData = await client.query({
      data: {
        query,
        variables,
      },
    });
    return adminData;
  } catch (error) {
    return undefined;
  }
}
