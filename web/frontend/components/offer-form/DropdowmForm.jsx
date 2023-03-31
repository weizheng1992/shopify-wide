import { useEffect, memo, useState, useCallback, useMemo } from "react";
import { Select, Button, InlineError } from "@shopify/polaris";

import LabelTip from "../LabelTip";

function DropdowmForm(params) {


  const options = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        label: index + 1,
        value: index + 1,
      })),
    []
  );
  return (
    <>
      <Select
        label={
          <LabelTip
            label={"Number of dropdowns "}
            tipContent={
              "Select how many times we will display the variants selector (based on the number of products in the offer)."
            }
          />
        }
        options={options}
        helpText='Your customers will need to select each option 1 time(s)'
      />
      

    </>
  );
}

export default memo(DropdowmForm);
