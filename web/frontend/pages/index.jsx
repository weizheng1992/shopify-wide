import { Card, Page, Layout } from "@shopify/polaris";
import { useNavigate, TitleBar } from "@shopify/app-bridge-react";

import { ProductsList } from "../components";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Page fullWidth>
      <TitleBar title="widebundle" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card
            sectioned
            title="product"
            actions={[
              {
                content: "Add offers",
                onAction: () => navigate("/product/select"),
              },
            ]}
          >
            <ProductsList />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
