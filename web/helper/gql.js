export const CREATE_PRODUCT_VARIANT_MUTATION = `
mutation productVariantCreate($input: ProductVariantInput!) {
  productVariantCreate(input: $input) {
    productVariant {
      id
      title
      price
      selectedOptions {
        name
        value
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const QUERY_PRODUCTS_LIMIT = `
query products($first: Int!, $after: String, $title: String) {
  products(first: $first, after: $after, query: $title) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        id
        title
      }
    }
  }
}
`;

export const PRODUCT_OFFER_ADMIN_QUERY = `
query getProduct($productId: ID!) {
  product(id: $productId) {
    id
    title
    hasOnlyDefaultVariant
    options {
      name
      values
    }
    variants(first: 10) {
      edges {
        node {
          id
          price
          compareAtPrice
           title
           selectedOptions{
            name
            value
           }
        }
      }
    }
  }
}
`;

export const PRODUCT_VARIANT_QUERY = `
query getproductVariant($id: ID!) {
  productVariant(id: $id) {
    title
    displayName
    createdAt
    price
    compareAtPrice
    inventoryQuantity
    availableForSale
    weight
    weightUnit
  }
}
`;

export const PRODUCT_UPDATE_MUTATION = `
mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      variants(first: 10) {
        edges {
          node {
            id
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;
