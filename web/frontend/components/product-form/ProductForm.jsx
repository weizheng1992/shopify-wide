import { useState, useCallback, useMemo } from "react";
import {
  Card,
  Form,
  FormLayout,
  TextField,
  TextContainer,
  Checkbox,
  Button,
  Link,
  Toast,
} from "@shopify/polaris";
import { ContextualSaveBar } from "@shopify/app-bridge-react";

import OfferForm from "../offer-form/OfferForm";
import LabelTip from "../LabelTip";
import RightView from "./RightView";

import useFormhooks from "./useFormhooks.js";
import OfferContext from "./useFormContext";

import "../product-form.css";

export function ProductForm({ offerInfo, productId }) {
  const [headingvalue, setHeadingvalue] = useState(offerInfo?.heading);
  const [toast, setToast] = useState(false);
  const [checkedOnHomepage, setCheckedOnHomepage] = useState(false);
  console.log(offerInfo?.list);
  const {
    addItem,
    removeItem,
    reset,
    dirty,
    fieldsList,
    submit,
    submitting,
    value,
  } = useFormhooks(
    offerInfo?.list,
    offerInfo?.id,
    headingvalue,
    productId,
    setToast
  );

  const handleOnHomepageChange = useCallback(
    (newChecked) => setCheckedOnHomepage(newChecked),
    []
  );

  const handleheadingChange = (val) => {
    setHeadingvalue(val);
  };

  const pId = useMemo(() => {
    const parry = productId.split("/");
    return parry[parry.length - 1];
  }, [productId]);

  const toggleToast = useCallback(() => setToast((active) => !active), []);

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
          title={
            <>
              Edit the offers on your product -
              <Link url={`/admin/products/${pId}`} external>
                {offerInfo?.title}
              </Link>
            </>
          }
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
                checked={checkedOnHomepage}
                onChange={handleOnHomepageChange}
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
      <RightView heading={offerInfo?.heading} list={value} />

      {toast ? (
        <Toast
          content={offerInfo?.id ? "Update success" : "Create success"}
          onDismiss={toggleToast}
        />
      ) : null}
    </>
  );
}
