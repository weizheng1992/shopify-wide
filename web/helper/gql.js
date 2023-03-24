// 创建Variant
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

// 获取shopify产品列表 分页
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

// 根据productId获取shopify产品详情-variants
export const QUERY_PRODUCT_OFFER_VARIANTS = `
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

// 根据id获取productVariant
export const QUERY_PRODUCT_VARIANT = `
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

// 更新shopify产品信息
export const MUTATION_PRODUCT_UPDATE = `
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

// 根据id 获取shopify商品信息

export const QUERY_PRODCUT_INFO = `query getProduct($productId: ID!) {
  product(id: $productId) {
    id
    title
  }
}
`;
