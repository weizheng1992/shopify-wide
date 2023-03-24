import { Stack, Tag, TextField, Button } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";

export default function TextTag({ label, placeholder, optionsTags }) {
  console.log(optionsTags);
  const [tags, setTags] = useState(optionsTags.defaultValue);
  const [textFieldValue, setTextFieldValue] = useState("");

  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    []
  );
  useEffect(() => {
    if (optionsTags.value && optionsTags.value.length > 0) {
      setTags(optionsTags.value);
    }
  }, [optionsTags.value]);

  const removeTag = useCallback(
    (tag) => () => {
      const newTags = tags.filter((previousTag) => previousTag !== tag);
      setTags(newTags);
      optionsTags.onChange(newTags);
    },
    []
  );

  const verticalContentMarkup =
    tags.length > 0 ? (
      <Stack spacing="extraTight" alignment="center">
        {tags.map((tag) => (
          <Tag key={tag} onRemove={removeTag(tag)}>
            {tag}
          </Tag>
        ))}
      </Stack>
    ) : null;

  const handleSubmit = () => {
    const newTags = [...tags, textFieldValue];
    setTags(newTags);
    console.log("xxxxxxxxx", newTags);
    optionsTags.onChange(newTags);
    setTextFieldValue("");
  };

  return (
    <TextField
      label={label}
      value={textFieldValue}
      onChange={handleTextFieldChange}
      placeholder={placeholder}
      autoComplete="off"
      verticalContent={verticalContentMarkup}
      connectedRight={<Button onClick={handleSubmit}>Submit</Button>}
    />
  );
}
