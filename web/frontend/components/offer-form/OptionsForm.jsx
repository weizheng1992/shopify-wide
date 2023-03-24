import { useEffect, memo, useState, useCallback, useMemo } from "react";
import {
  Collapsible,
  Card,
  TextField,
  Icon,
  FormLayout,
  Button,
  InlineError,
} from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useDynamicList, useSubmit } from "@shopify/react-form";

import LabelTip from "../LabelTip";
import TextTag from "./TextTag";
import OptionsItem from './OptonsItem'

const indexToEn = ["first", "second"];
const initOptions = { optionsName: "", optionsTags: [] };

function OptionsForm({ optionsChecked, list, onChange, error, onBlur }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (optionsChecked) {
      setVisible(true);
    }
  }, [optionsChecked]);

  const fList = useMemo(
    () => ({
      list: list && list.length > 0 ? list : [initOptions],
      validates: {
        optionsTags: (optionsTags, data) => {
          console.log("sdadasd", optionsTags, data);
          if (!optionsTags || optionsTags.length === 0) {
            return " You need to add values for this option";
          }
        },
        optionsName: (optionsName) => {
          if (!optionsName) {
            return " You need to add name for this option";
          }
        },
      },
    }),
    []
  );

  const emptyCardFactory = () => initOptions;
  const {
    fields: fieldsList,
    addItem,
    removeItem,
    value,
  } = useDynamicList(fList, emptyCardFactory);

  useEffect(() => {
    onChange(value);
    onBlur();
  }, [value]);

  const handleRemove = (index) => {
    removeItem(index);
  };

  if (!visible) {
    return null;
  }
  return (
    <>
      <Collapsible
        open={optionsChecked}
        id="options"
        transition={{
          duration: "500ms",
          timingFunction: "ease-in-out",
        }}
        expandOnPrint
      >
        {fieldsList.map((item, index) => (
          <OptionsItem index={index + 1} key={index} {...item} />
        ))}
        <Button plain destructive onClick={addItem}>
          + Add another option
        </Button>
      </Collapsible>
      <div style={{ marginTop: "4px", display: error ? "block" : "none" }}>
        <InlineError message={error} />
      </div>
    </>
  );
}
export default memo(OptionsForm);
