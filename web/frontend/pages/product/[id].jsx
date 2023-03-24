import { Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useSearchParams } from "react-router-dom";
import { ProductForm } from "../../components";

export default function ProductEdit() {
  const breadcrumbs = [{ content: "Offers", url: "/" }];
  const { id } = useSearchParams();
  return (
    <Page>
      <TitleBar
        title="Create new offer"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <ProductForm />
    </Page>
  );
}
