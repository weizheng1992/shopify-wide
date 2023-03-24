import { useState, useCallback, useMemo } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  TextContainer,
  Checkbox,
  Button,
} from "@shopify/polaris";
import { ContextualSaveBar, useNavigate } from "@shopify/app-bridge-react";
import { useDynamicList, useSubmit } from "@shopify/react-form";

import OfferForm from "../offer-form/OfferForm";
import LabelTip from "../LabelTip";
import RightView from "./RightView";
import "../product-form.css";

import { useAuthenticatedFetch } from "../../hooks";

const init = [{ title: "", price: "", compareAtPrice: "" }];

export function ProductForm({ offerInfo, productId }) {
  const [offer, setOffer] = useState(offerInfo);
  const [headingvalue, setHeadingvalue] = useState(offerInfo.heading);
  const fetch = useAuthenticatedFetch();

  const list = useMemo(
    () => ({
      list: offerInfo?.list || init,
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
    [offerInfo.list]
  );

  const emptyCardFactory = () => ({
    title: "",
    price: "",
    compareAtPrice: "",
    list: [],
  });

  const {
    fields: fieldsList,
    addItem,
    removeItem,
    removeItems,
    moveItem,
    reset,
    dirty,
    value,
    newDefaultValue,
    defaultValue,
  } = useDynamicList(list, emptyCardFactory);

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
        const response = await fetch("/api/offer/create", {
          method: "POST",
          body: JSON.stringify(parsedBody),
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const offer = await response.json();
          console.log(offer);
        }
      })();
      return { status: "success" };
    },
    [value, headingvalue]
  );

  const { submit, submitting } = useSubmit(onSubmit, fieldsList);

  // const dirty = useDirty(fields);
  // const reset = useReset(fields);

  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  const handleheadingChange = (val) => {
    setHeadingvalue(val);
  };

  return (
    <>
      <div
        style={{
          marginRight: "30%",
          width: "50%",
          marginLeft: "10%",
        }}
      >
        <Card
          title={`Edit the offers on your product -${offer?.title}`}
          sectioned
        >
          <Form>
            <ContextualSaveBar
              saveAction={{
                label: "Save",
                onAction: submit,
                loading: submitting,
                disabled: submitting,
              }}
              discardAction={{
                label: "Discard",
                onAction: reset,
                loading: submitting,
                disabled: submitting,
              }}
              visible={dirty}
              fullWidth
            />
            <FormLayout>
              <TextField
                label={
                  <LabelTip
                    label={" Heading above offers"}
                    tipContent={
                      "This text will appear above WideBundle widget and should tell your customers to select one of the offers."
                    }
                  />
                }
                value={headingvalue}
                onChange={handleheadingChange}
              />
              <Checkbox
                label={
                  <LabelTip
                    label={"This product is featured on the homepage"}
                    tipContent={
                      "Check the box if this product appears on the homepage of your store"
                    }
                  />
                }
                checked={checked}
                onChange={handleChange}
              />
              <TextContainer>Configure your offers</TextContainer>
              {fieldsList.map((item, index) => (
                <OfferForm
                  key={index}
                  {...item}
                  offerIndex={index}
                  removeItem={removeItem}
                />
              ))}
              <Button onClick={() => addItem()}>+ Add an offer</Button>
            </FormLayout>
          </Form>
        </Card>
      </div>
      <RightView heading={offerInfo.heading} list={value} />
    </>
  );
}
