import { useState, useCallback, useEffect, memo } from "react";
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
  Card,
} from "@shopify/polaris";

import {
  ChevronUpMinor,
  ChevronDownMinor,
  CircleInformationMajor,
  DeleteMajor,
} from "@shopify/polaris-icons";

import OptionsForm from "./OptionsForm";

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
    list.value && list.value.length > 0 && true
  );
  const handleOptionsChange = () => {
    setOptionsChecked((prev) => !prev);
  };

  // useEffect(() => {
  //   if (list.value && list.value.length > 0 && !optionsChecked) {
  //     setOptionsChecked(true);
  //   }
  // }, [list.value]);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <div style={{ border: "1px solid black", padding: 20 }}>
      <Stack>
        <Stack.Item fill>
          <FormLayout>
            <TextField
              label={
                <Stack>
                  <TextContainer>Offer title</TextContainer>
                  <Tooltip content="The name of the offer to explain what people will receive. ">
                    <Icon source={CircleInformationMajor} />
                  </Tooltip>
                </Stack>
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
                  <Stack>
                    <TextContainer>Thumbnail url (optional)</TextContainer>
                    <Tooltip content="Add a picture on the offer to show people what they will get">
                      <Icon source={CircleInformationMajor} />
                    </Tooltip>
                  </Stack>
                }
                placeholder="https://cdn.shopify.com/file/xxxxx"
              />
              <FormLayout>
                <Stack distribution="fill">
                  <TextField
                    label={
                      <Stack>
                        <TextContainer>Price</TextContainer>
                        <Tooltip content="Current price of the offer people will pay">
                          <Icon source={CircleInformationMajor} />
                        </Tooltip>
                      </Stack>
                    }
                    {...price}
                    type="number"
                    placeholder="10"
                  />
                  <TextField
                    label={
                      <Stack>
                        <TextContainer>Compared price (optional)</TextContainer>
                        <Tooltip content="Old price that will appear crossed">
                          <Icon source={CircleInformationMajor} />
                        </Tooltip>
                      </Stack>
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
                  <Stack>
                    <TextContainer>
                      This offer has options, like size or color
                    </TextContainer>
                    <Tooltip content="Check this box if the product in your offer exists in several variations.">
                      <Icon source={CircleInformationMajor} />
                    </Tooltip>
                  </Stack>
                }
                checked={optionsChecked}
                onChange={handleOptionsChange}
              />
            </Collapsible>
            <OptionsForm
              optionsChecked={optionsChecked}
              list={[...list.value]}
              onChange={list.onChange}
            />
          </FormLayout>
        </Stack.Item>
        <Stack.Item>
          {open ? (
            <Button plain icon={ChevronDownMinor} onClick={handleToggle} />
          ) : (
            <Button plain icon={ChevronUpMinor} onClick={handleToggle} />
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
