import { useState, useCallback, useEffect, memo, useMemo } from "react";
import {
  FormLayout,
  TextField,
  Button,
  Icon,
  Stack,
  TextContainer,
  Collapsible,
  Tooltip,
  Checkbox,
  Select,
} from "@shopify/polaris";

import {
  ChevronUpMinor,
  ChevronDownMinor,
  CircleInformationMajor,
  DeleteMajor,
} from "@shopify/polaris-icons";

import OptionsForm from "./OptionsForm";
import LabelTip from "../LabelTip";

function OfferForm({
  title,
  price,
  compareAtPrice,
  list,
  removeItem,
  offerIndex,
}) {
  const [open, setOpen] = useState(true);
  const [optionsChecked, setOptionsChecked] = useState(
    list?.value && list?.value.length > 0 && true
  );

  // options 选中显示options列表，否则隐藏
  const handleOptionsChange = () => {
    setOptionsChecked((prev) => !prev);
  };

  // 每列offer的显示和隐藏
  const handleOfferToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <div style={{ border: "1px solid black", padding: 20 }}>
      <Stack>
        <Stack.Item fill>
          <FormLayout>
            <TextField
              label={
                <LabelTip
                  label={"Offer title"}
                  tipContent={
                    "The name of the offer to explain what people will receive. "
                  }
                />
              }
              {...title}
            />
            <Collapsible
              open={open}
              id="offer"
              transition={{
                duration: "500ms",
                timingFunction: "ease-in-out",
              }}
              expandOnPrint
            >
              <TextField
                label={
                  <LabelTip
                    label={"Thumbnail url (optional)"}
                    tipContent={
                      "Add a picture on the offer to show people what they will get "
                    }
                  />
                }
                placeholder="https://cdn.shopify.com/file/xxxxx"
              />
              <FormLayout>
                <Stack distribution="fill">
                  <TextField
                    label={
                      <LabelTip
                        label={"Price"}
                        tipContent={
                          "Current price of the offer people will pay"
                        }
                      />
                    }
                    {...price}
                    type="number"
                    placeholder="10"
                  />
                  <TextField
                    label={
                      <LabelTip
                        label={"Compared price (optional)"}
                        tipContent={"Old price that will appear crossed"}
                      />
                    }
                    {...compareAtPrice}
                    type="number"
                    placeholder="20"
                  />
                </Stack>
              </FormLayout>
              <div
                style={{
                  fontSize: "1.1em",
                  color: "#3f3f3f",
                  fontWeight: "bold",
                  margin: "1rem 0",
                }}
              >
                Options
              </div>

              <Checkbox
                label={
                  <LabelTip
                    label={"This offer has options, like size or color"}
                    tipContent={
                      "Check this box if the product in your offer exists in several variations."
                    }
                  />
                }
                checked={optionsChecked}
                onChange={handleOptionsChange}
              />
            </Collapsible>
            <FormLayout.Group>
              {list && (
                <OptionsForm
                  optionsChecked={optionsChecked}
                  list={list?.value}
                  onChange={list.onChange}
                  error={list.error}
                  onBlur={list.onBlur}
                />
              )}
            </FormLayout.Group>
           
          </FormLayout>
        </Stack.Item>
        <Stack.Item>
          {open ? (
            <Button plain icon={ChevronDownMinor} onClick={handleOfferToggle} />
          ) : (
            <Button plain icon={ChevronUpMinor} onClick={handleOfferToggle} />
          )}
        </Stack.Item>
      </Stack>
      <Stack distribution="trailing">
        <Button
          plain
          icon={DeleteMajor}
          onClick={() => removeItem(offerIndex)}
        ></Button>
      </Stack>
    </div>
  );
}

export default memo(OfferForm);
