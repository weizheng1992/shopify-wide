import { Page, Card, Layout, SkeletonBodyText } from "@shopify/polaris";
import { TitleBar, Loading } from "@shopify/app-bridge-react";
import { useSearchParams } from "react-router-dom";
import { ProductForm } from "../../components";
import { useAppQuery } from "../../hooks";

export default function New() {
  const breadcrumbs = [{ content: "Offers", url: "/" }];
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { data, isLoading, isRefetching } = useAppQuery({
    url: `/api/product/${encodeURIComponent(id)}`,
    reactQueryOptions: {
      /* Disable refetching because the QRCodeForm component ignores changes to its props */
      refetchOnReconnect: false,
    },
  });

  if (isLoading || isRefetching) {
    return (
      <Page>
        <TitleBar
          title="Create new offer"
          breadcrumbs={breadcrumbs}
          primaryAction={null}
        />
        <Loading />
        <Layout>
          <Layout.Section>
            <Card sectioned title="Title">
              <SkeletonBodyText />
            </Card>
            <Card title="Product">
              <Card.Section>
                <SkeletonBodyText lines={1} />
              </Card.Section>
              <Card.Section>
                <SkeletonBodyText lines={3} />
              </Card.Section>
            </Card>
            <Card sectioned title="Discount">
              <SkeletonBodyText lines={2} />
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <Card sectioned title="QR code" />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page fullWidth>
      <TitleBar
        title="Create new offer"
        breadcrumbs={breadcrumbs}
        primaryAction={null}
      />
      <ProductForm productId={id} offerInfo={data} />
      {/* <ProductForm  /> */}
    </Page>
  );
}
