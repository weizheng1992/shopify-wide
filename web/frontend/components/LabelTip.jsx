import { Stack, TextContainer, Tooltip, Icon } from "@shopify/polaris";
import { CircleInformationMajor } from "@shopify/polaris-icons";

export default function LabelTip({
  label,
  tipContent,
  icon = CircleInformationMajor,
}) {
  return (
    <Stack>
      <TextContainer> {label}</TextContainer>
      <Tooltip content={tipContent}>
        <Icon source={icon} />
      </Tooltip>
    </Stack>
  );
}
