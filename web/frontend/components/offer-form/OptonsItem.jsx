import { TextField, Button, Card, FormLayout } from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";
import LabelTip from "../LabelTip";
import TextTag from "./TextTag";
import { memo } from "react";
const indexToEn = ["first", "second"];
function OptionsItem({ index, optionsName, optionsTags }) {
  return (
    <Card sectioned key={index}>
      <FormLayout>
        <TextField
          label={
            <LabelTip
              label={`Option ${index} name`}
              tipContent={`Add the name of the ${indexToEn[index]} option`}
            />
          }
          connectedRight={
            <Button
              plain
              icon={DeleteMajor}
              onClick={() => handleRemove(index - 1)}
            ></Button>
          }
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
  );
}
export default memo(OptionsItem);
