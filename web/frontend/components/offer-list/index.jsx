import {
  EmptySearchResult,
  IndexTable,
  Card,
  Pagination,
  Link,
  SkeletonBodyText,
} from "@shopify/polaris";
import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import ProductList from "./ProductList";

export function OfferList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: { createdAt: -1 },
  });

  const fetch = useAuthenticatedFetch();

  const fetchData = useCallback(async () => {
    const response = await fetch("/api/offer/list", {
      method: "POST",
      body: JSON.stringify({
        options: params,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    }
  }, [params.page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = async (page) => {
    setParams({ ...prev, page });
  };

  const emptyStateMarkup =
    !isLoading && !data?.list?.length ? (
      <Card sectioned>
        <EmptyState
          heading="Create unique Offers for your product"
          action={{
            content: "Create Offer",
            onAction: () => navigate("/product/new"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          {/* <p>
            Allow customers to scan codes and buy products using their phones.
          </p> */}
        </EmptyState>
      </Card>
    ) : null;

  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  const offerMarkup = data?.list?.length ? (
    <ProductList
      {...data}
      loading={isLoading}
      onPageChange={handlePageChange}
    />
  ) : null;

  return (
    <Card>
      {loadingMarkup}
      {emptyStateMarkup}
      {offerMarkup}
    </Card>
  );
}
