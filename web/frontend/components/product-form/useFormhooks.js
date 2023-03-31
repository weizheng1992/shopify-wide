import { useMemo, useCallback } from "react";
import { useDynamicList, useSubmit } from "@shopify/react-form";

import { useAuthenticatedFetch } from "../../hooks";

const init = [{ title: "", price: "", compareAtPrice: "" }];

export default function useFormhooks(
  offerList,
  id,
  headingvalue,
  productId,
  setToast
) {
  const fetch = useAuthenticatedFetch();

  // 创建表单项和表单验证
  const dynamicList = useMemo(
    () => ({
      list: offerList || init,
      validates: {
        price: (price) => {
          var reg = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 ，判断正整数用/^[1-9]+[0-9]*]*$/
          if (price !== null && price !== "") {
            if (!reg.test(price)) {
              return "请输入数字";
            }
          } else {
            return " You need to add a price";
          }
        },
        title: (title) => {
          if (title === "") {
            return " You need to add a title for this offer";
          }
        },
        list: (list, data) => {
          if (list.length > 0) {
            const listItemLength = Array.isArray(data.listItem.list.value)
              ? data.listItem.list.value.length
              : 0;

            const siblingsLength = Array.isArray(data.siblings)
              ? data.siblings.reduce((acc, sibling) => {
                  return Array.isArray(sibling.list.value)
                    ? acc + sibling.list.value.length
                    : acc;
                }, 0)
              : 0;
            if (listItemLength !== siblingsLength) {
              return " All your offers need to have the same amount of options";
            }
          }
        },
      },
    }),
    [offerList]
  );

  // addItem添加的默认项
  const emptyCardFactory = () => ({
    title: "",
    price: "",
    compareAtPrice: "",
    list: [],
  });

  // 表单数组验证
  // https://www.npmjs.com/package/@shopify/react-form
  const {
    fields: fieldsList,
    addItem,
    removeItem,
    reset,
    dirty,
    value,
  } = useDynamicList(dynamicList, emptyCardFactory);

  // 表单提交
  const onSubmit = useCallback(
    (body) => {
      (async () => {
        const parsedBody = {
          variants: [],
        };
        const keys = Object.keys(body);

        for (let index = 0; index < keys.length; index++) {
          const element = body[index];
          parsedBody.variants.push(element);
        }

        parsedBody.productId = productId;
        parsedBody.heading = headingvalue;
        const url = id ? `/api/offer/${id}` : "/api/offer/create";
        const method = id ? "PATCH" : "POST";
        const response = await fetch(url, {
          method,
          body: JSON.stringify(parsedBody),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const offer = await response.json();
          setToast(true);
        }
      })();
      return { status: "success" };
    },
    [value, headingvalue, id, setToast]
  );

  // 处理提交状态
  const { submit, submitting } = useSubmit(onSubmit, fieldsList);

  return {
    addItem,
    removeItem,
    reset,
    dirty,
    fieldsList,
    submit,
    submitting,
    value,
  };
}
