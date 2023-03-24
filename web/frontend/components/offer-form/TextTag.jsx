import { Stack, Tag, TextField, Button } from "@shopify/polaris";
import { useState, useCallback, useEffect, memo } from "react";

function TextTag({ label, placeholder, optionsTags }) {
  console.log(optionsTags);
  const [tags, setTags] = useState(optionsTags.value);
  const [textFieldValue, setTextFieldValue] = useState("");

  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    []
  );

  const removeTag = (index) => () => {
    tags.splice(index, 1);
    setTags(tags);
    optionsTags.onChange(tags);
    optionsTags.onBlur();
  };

  const handleSubmit = () => {
    const newTags = [...tags, textFieldValue];
    setTags(newTags);
    setTextFieldValue("");
    optionsTags.onChange(newTags);
    optionsTags.onBlur();
    optionsTags.setError("");
  };

  const verticalContentMarkup =
    tags.length > 0 ? (
      <Stack spacing="extraTight" alignment="center">
        {tags.map((tag, index) => (
          <Tag key={tag} onRemove={removeTag(index)}>
            {tag}
          </Tag>
        ))}
      </Stack>
    ) : null;
  return (
    <TextField
      error={optionsTags.error}
      label={label}
      value={textFieldValue}
      onChange={handleTextFieldChange}
      placeholder={placeholder}
      verticalContent={verticalContentMarkup}
      connectedRight={<Button onClick={handleSubmit}>Submit</Button>}
    />
  );
}
export default memo(TextTag);
