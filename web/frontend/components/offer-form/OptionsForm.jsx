import { useEffect, memo, useState, useCallback } from "react";
import {
  Collapsible,
  Card,
  TextField,
  Icon,
  FormLayout,
  Button,
} from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useDynamicList } from "@shopify/react-form";

import LabelTip from "../LabelTip";
import TextTag from "./TextTag";

const indexToEn = ["first", "second"];

function OptionsForm({ optionsChecked, list, onChange }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (optionsChecked) {
      setVisible(true);
    }
  }, [optionsChecked]);

  console.log("---", list);
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
  } = useDynamicList(
    list && list.length > 0 ? list : [{ optionsName: "", optionsTags: [] }]
  );

  useEffect(() => {
    onChange(value);
  }, [value]);

  const handleAddOption = () => {
    console.log("add");
  };

  const OptionsItem = useCallback(
    ({ index, optionsName, optionsTags }) => (
      <Card sectioned>
        <FormLayout>
          <TextField
            label={
              <LabelTip
                label={`Option ${index} name`}
                tipContent={`Add the name of the ${indexToEn[index]} option`}
              />
            }
            connectedRight={<Icon source={DeleteMajor} />}
            {...optionsName}
          />
          <TextTag
            label={
              <LabelTip
                label={`Option ${index} values`}
                tipContent={`Add the different variants for the ${indexToEn[index]}  option`}
              />
            }
            optionsTags={optionsTags}
          />
        </FormLayout>
      </Card>
    ),
    []
  );

  if (!visible) {
    return null;
  }
  return (
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
        <OptionsItem key={index} index={index + 1} {...item} />
      ))}
      <Button plain destructive onClick={handleAddOption}>
        + Add another option
      </Button>
    </Collapsible>
  );
}
export default memo(OptionsForm);
