// 生成下拉框选项
const generateOptions = (options) => {
  let html = "";
  options.forEach((option) => {
    html += `
      <p class="title-option-wb">${option.name}</p>
      <select class="select-bundle select-class-second select-option-second" onchange="changePrice()">
        ${option.values
          .map((value) => `<option value="${value}">${value}</option>`)
          .join("")}
      </select>
    `;
  });
  return html;
};

// 生成商品的 HTML
const generateProductHTML = (product, index) => {
  const { id, title, price, comparedPrice, options } = product;
  // const priceHTML = prices
  //   .map(
  //     (price) => `
  //       <p class="wb_hidden_prices_element">
  //         <span class="wb_hidden_price money conversion-bear-money transcy-money" variant-id="${price.variantId}">${price.price}</span>
  //         <span class="wb_hidden_compared_price money conversion-bear-money transcy-money" variant-id="${price.variantId}">${price.comparedPrice}</span>
  //       </p>
  //     `
  //   )
  //   .join("");

  const classSelect = index === 0 ? "selectedWB" : "selectable";
  window.G_VARIANTID = index === 0 && id;
  let html = `
    <div id="id${id}" class="new-form-option  ${classSelect}" data-id="${id}">
      <div class="value-left">
        <span class="checkedWB"></span>
      </div>
      <div class="value-right">
        <p class="title-variant">${title}</p>
        <p class="price-new-form">
          <span class="first-price-WB money conversion-bear-money transcy-money">\$${price}</span>
          <span class="second-price-WB conversion-bear-money">`;
  if (comparedPrice) {
    html += `<s class="crossed-price-WB">\$${comparedPrice}</s>`;
  }
  html += `</span>
       </p>
        <div class="div-second-select-${id}-1 div-select2 has-double-select" data-id="${id}">
          ${generateOptions(options)}
          <p class="clear"></p>
        </div>
      </div>
    </div>
  `;
  return html;
};

// 生成所有商品的 HTML
const generateProductsHTML = (products, offer) => {
  let html = offer.heading
    ? `<p class="p-title-WB"><span id="title-offer-WB" class="p-title-WB__content">${offer.heading}</span></p>`
    : "";
  products.map((product, index) => {
    html += generateProductHTML(product, index);
  });
  html += ` <div
            data-add-to-cart=""
            id="new-form-atc"
            class="new-form-atc addCart"
            aria-label="Add to cart"
          >
            Add To Cart
          </div>`;
  return html;
};

// offer class添加和修改
const selectOption = (id) => {
  const newForm = document.getElementById("new-form");
  const selectedOption = newForm.querySelector(".new-form-option.selectedWB");
  if (selectedOption) {
    selectedOption.classList.remove("selectedWB");
    selectedOption.classList.add("selectable");
  }
  const option = newForm.querySelector(`.new-form-option[data-id="${id}"]`);
  if (option) {
    option.classList.remove("selectable");
    option.classList.add("selectedWB");
  }
  changePrice();
};

// offer 点击事件
const handleOfferClick = (event) => {
  const target = event.target;
  const option = target.closest(".new-form-option");
  if (option && !option.classList.contains("selectedWB")) {
    const id = option.getAttribute("data-id");
    selectOption(id);
  }
};

// 添加商品到页面
const addProductsToPage = (products, offer) => {
  const newForm = document.getElementById("new-form");
  if (newForm) {
    newForm.innerHTML = generateProductsHTML(products, offer);
    newForm.addEventListener("click", handleOfferClick);
  }
};

// const addPriceToPage = (price, compareAtPrice) => {
//   const priceDom = document.getElementsByClassName("price")[0];

//   while (priceDom.firstChild) {
//     priceDom.removeChild(priceDom.firstChild);
//   }
//   html = ` <span class="first-price-WB money conversion-bear-money transcy-money" style="color: rgb(188, 35, 35);">\$${price}</span>
//   <span class="second-price-WB money transcy-money conversion-bear-money" style="color: rgb(152, 152, 152);">
//   `;
//   if (compareAtPrice) {
//     html += `
//     <s class="crossed-price-WB">\$${compareAtPrice}</s>
//   `;
//   }
//   html += "</span>";
//   priceDom.innerHTML = html;
// };

// 价格变化处理函数
const changePrice = () => {
  const selectedOptions = Array.from(
    document.querySelectorAll(".selectedWB .div-select2 select")
  ).map((select) => select.value);
  const firstPrice = document.querySelector(".price .first-price-WB");
  const secondPrice = document.querySelector(".price .second-price-WB");
  const options1 = document.querySelector(
    ".selectedWB .title-variant"
  ).textContent;
  selectedOptions.unshift(options1);
  // 根据选择的选项，找到对应的价格
  let price = null;
  let comparedPrice = null;
  window.G_OFFER_LIST.map((item) => {
    const options = item.options;
    if (
      options.length === selectedOptions.length &&
      options.every((value, index) => value === selectedOptions[index])
    ) {
      price = item.price;
      comparedPrice = item.comparedPrice;
      window.G_VARIANTID = item.variantId;
    }
  });

  // 更新价格
  if (price) {
    firstPrice.textContent = "$" + price;
    if (comparedPrice) {
      secondPrice.innerHTML = `<s class="crossed-price-WB">\$${comparedPrice}</s>`;
    } else {
      secondPrice.innerHTML = "";
    }
  }
};

const handleAddToCart = () => {
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: [{ quantity: 1, id: window.G_VARIANTID }] }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      window.location.href = window.location.origin + "/cart";
    });
};

// 添加购物车点击事件
const addCartaddEvent = () => {
  const addToCartBtn = document.querySelector("#new-form-atc");
  addToCartBtn.addEventListener("click", handleAddToCart);
};

/***** price处理 start ***** */
// 隐藏元素的函数
function hidePriceElements(elements) {
  for (let element of elements) {
    element.style.display = "none";
  }
}

function showPriceDom() {
  if (window.G_priceElement) {
    window.G_priceElement.innerHTML = document.querySelector(
      ".selectedWB .price-new-form"
    ).innerHTML;
  }
}
// 查找价格元素的函数
function findPriceElement(prices, container) {
  for (let priceSelector of prices) {
    let priceElement = container.querySelector(priceSelector);
    if (priceElement) {
      return { element: priceElement, selector: priceSelector };
    }
  }
  return null;
}

function hidePrice() {
  pricesWB = [
    ".product-item-caption-price",
    ".ProductMeta__PriceList",
    "#price_ppr",
    ".product-single__prices",
    ".product-featured__price-text",
    ".product__price",
    ".gf_product-prices",
    "#productPrice-product-template",
    ".productTemplatePrice",
    ".product-price",
    "div[data-product-type=price]",
    ".modal_price",
    ".featured-product-section .product-single .box .product-wrapper .product-details .product-single__meta .price-wrapper",
    ":not(.wb_hidden_prices_element) .price",
    ".product-meta h1",
    ".price-wrapper",
    ".product-single__price",
    ".tt-price",
    ".gt_flex.price_product",
    ".pt-price",
    ".gt-product-price",
    "span[data-zp-product-discount-price]",
    ".t4s-product-price",
  ];

  const blocsToGetPricesWB = [".featured_product_se"];

  window.G_priceElement = null;
  let priceSelector = "";
  // 在指定的容器中查找价格元素
  for (let blockSelector of blocsToGetPricesWB) {
    const container = document.querySelector(blockSelector);
    if (container) {
      const result = findPriceElement(pricesWB, container);
      if (result) {
        priceElement = result.element;
        priceSelector = result.selector;
        break;
      }
    }
  }
  // 在整个文档中查找价格元素（如果在指定容器中未找到）
  if (!window.G_priceElement) {
    const result = findPriceElement(pricesWB, document);
    if (result) {
      window.G_priceElement = result.element;
      priceSelector = result.selector;
    }
  }

  try {
    if (window.G_priceElement) {
      // 隐藏不需要的价格元素
      hidePriceElements(
        document.getElementsByClassName("product-single__price--wrapper")
      );
      hidePriceElements(
        document.getElementsByClassName("product__price--compare")
      );
      // 处理 ProductPrice, ComparePrice, sale_price 的隐藏
      const productPrice = document.getElementById("ProductPrice");
      const comparePrice = document.getElementById("ComparePrice");
      const salePrice = document.getElementsByClassName("sale_price")[0];

      if (
        productPrice &&
        comparePrice &&
        salePrice &&
        !document.getElementsByClassName("price").length
      ) {
        hidePriceElements([productPrice, comparePrice, salePrice]);
        comparePrice.style.fontSize = "0px";
        productPrice.style.fontSize = "0px";
      }

      // 处理 ".gt-product-price" 的隐藏
      if (
        priceSelector === ".gt-product-price" &&
        document.querySelectorAll(".gt-product-compare-price")[0]
      ) {
        document.querySelectorAll(
          ".gt-product-compare-price"
        )[0].style.display = "none";
      }
      // 隐藏 'product-action' 元素
      hidePriceElements(document.getElementsByClassName("product-action"));

      // 隐藏 'compare_at_price' 和 'ProductPrice' 元素
      if (
        document.querySelector(
          'div[data-product-type="compare_at_price"][data-pf-type="ProductPrice"]'
        )
      ) {
        document.querySelector(
          'div[data-product-type="compare_at_price"][data-pf-type="ProductPrice"]'
        ).style.display = "none";
      }
    }
  } catch (error) {
    console.log(error);
  }
}
/*** price end  ****/

function isDescendant(parent, child) {
  let node = child.parentNode;
  while (node) {
    if (node === parent) {
      return true;
    }

    // Traverse up to the parent
    node = node.parentNode;
  }

  // Go up until the root but couldn't find the `parent`
  return false;
}

/**表单处理 start */
// 判断给定的表单是否属于异常列表
function isException(form, exceptions) {
  return exceptions.some((exceptionSelector) => {
    const exceptionElements = document.querySelectorAll(exceptionSelector);
    return Array.from(exceptionElements).some((exception) => {
      return (
        form === exception ||
        isDescendant(exception, form) ||
        isDescendant(form, exception)
      );
    });
  });
}

// 判断给定的表单是否有效（不仅包含隐藏元素）
function isFormValid(form) {
  const childElements = form.querySelectorAll("*");
  return Array.from(childElements).some((child) => child.type !== "hidden");
}

// 表单隐藏
function formHidden() {
  //Unwanted forms as child/parent/form

  const formsSameElementException = [
    ".checkout-x-buy-now-btn",
    ".price-descriptors .shopify-product-form",
  ];
  const formsException = [
    ".sticky-cart-form",
    "#form-sticky",
    ".container-sticky_addtocart",
    ".sticky-barre-content",
    "#shopify-section-header",
    ".product-recommendations-placeholder",
    ".sticky-atc-title",
    ".search-form",
    ".sticky-dropdownvar",
    "header.site-header",
    "#popUps .cart_upsell_popup",
    "#popUps .cart_downsell_popup",
    ".product-upsell-holder",
    "#product-form-installment",
    ".sticky_addcart",
    ".product-upsell__holder",
    "#ShippingModal",
    ".collection .card-wrapper .card__content",
    "#featured-product-scroll .product--variant",
    "product-sticky-form",
    "#rio-upsell",
    ".t4s-product-tabs-wrapper",
    'div[data-extraclass="sticky-atc"]',
    "#shopify-section-pr_description",
    ".cu-upsell",
    "#CartDrawer",
    "cart-drawer.cart-drawer",
  ];

  //Forms we want to check
  forms = [
    ".w-commerce-commerceaddtocartform.default-state-2",
    ".product-form",
    ".productForm",
    'product-form form[data-type="add-to-cart-form"]',
    ".product-form__buy-buttons .shopify-product-form",
    ".shopify-product-form",
    "#addToCartFormId1",
    ".t4s-product__info-wrapper form.t4s-form__product",
    "#AddToCartForm--product-template",
    ".product-form-product-template",
    ".product-form.hidedropdown",
    ".addToCartForm",
    ".product-single__meta .product-single__meta-info .product-single__form",
    ".ProductForm",
    ".product-single__form",
    ".prod_form",
    "#addToCartForm-product-template-optimised",
    ".shg-product-atc-btn-wrapper",
    'form[data-type="add-to-cart-form"].form',
    "form[action='/cart/add']",
    "#addToCartForm",
    ".form-vertical",
    "#prodForm",
    "form[data-product-form]",
    "#add-to-cart-form",
    "form[action$='/cart/add']",
    ".product-single__form:nth-child(2)",
  ];

  let chosenForm;

  for (const formSelector of forms) {
    const formList = document.querySelectorAll(formSelector);

    for (const form of formList) {
      if (
        isException(form, formsException) ||
        isException(form, formsSameElementException)
      ) {
        continue;
      }

      if (isFormValid(form)) {
        chosenForm = form;
        break;
      }
    }

    if (chosenForm) {
      break;
    }
  }
  const newForm = document.createElement("div");
  newForm.id = "new-form";
  chosenForm.parentNode.insertBefore(newForm, chosenForm.nextSibling);
  chosenForm.style.display = "none";
  window.addEventListener("load", HideFormWB, false); //We had some trouble with some themes where the form was not hidden so we hide it again after window is loaded
  function HideFormWB() {
    chosenForm.style.display = "none";
  }
}
/**表单处理 end */

/***隐藏选择数量 start */
function hiddenQuantity() {
  // 定义选择器数组，其中包含要隐藏的页面元素的 CSS 选择器
  const selectorsToHide = [
    ".dbtfy-color_swatches",
    ".product-layout-grid__detail .product-detail__options",
    ".product__info-wrapper variant-radios",
    "div[data-variant-picker]",
    ".product-detail__form__options.product-detail__gap-lg.product-detail__form__options--underlined",
    ".product-block-container .product-block.product-block-variant-picker:not(.pb-card-shadow)",
    ".product-block-container .product-block.product-block-quantity-selector:not(.pb-card-shadow)",
    ".product-form__quantity",
    ".product-block-item.atc-wrapper",
    ".product__quantity",
    ".product-form product-variants",
    ".tt-swatches-container",
    ".product__quantity",
    ".product-info__quantity-selector",
    "variant-picker",
    "product-page product-variants",
    ".product__variants-wrapper.product__block",
    ".product__controls-group-quantity.product__block",
    ".product-options--root",
    ".quantity_selector",
    ".productView-subtotal",
    ".productView-options",
  ];

  // 定义一个函数，该函数接受一个选择器数组，并隐藏与这些选择器匹配的页面元素
  const hideElementsBySelectors = (array) => {
    array.forEach((selector) => {
      const element = document.querySelector(selector);
      // 如果当前选择器在页面上匹配到元素，隐藏该元素
      if (element) element.style.display = "none";
    });
  };

  // 调用函数，传入选择器数组，隐藏相应的页面元素
  hideElementsBySelectors(selectorsToHide);
}

/***隐藏选择数量 end */

console.log(window.G_PRODUCT_ID);
const init = () => {
  hidePrice();
  formHidden();
  hiddenQuantity();
  fetch(`http://localhost:54580/web/offer/${window.G_PRODUCT_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // 初始化
      console.log("MMMMMMMMM");
      addProductsToPage(data.weblist, data.offer);
      // addPriceToPage(data.list[0].price, data.list[0].compareAtPrice);
      addCartaddEvent();
      showPriceDom();
      window.G_OFFER_LIST = data.list;
    })
    .catch((error) => console.error(error));
};

init();
