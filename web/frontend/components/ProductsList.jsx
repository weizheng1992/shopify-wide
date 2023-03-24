import {
  EmptySearchResult,
  IndexTable,
  Card,
  TextContainer,
} from "@shopify/polaris";
import React from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsList() {
  const customers = [];
  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const {
    data,
    isLoading,

    /*
        react-query provides stale-while-revalidate caching.
        By passing isRefetching to Index Tables we can show stale data and a loading state.
        Once the query refetches, IndexTable updates and the loading state is removed.
        This ensures a performant UX.
      */
    isRefetching,
  } = useAppQuery({
    url: "/api/product/offerList",
  });

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No customers yet"}
      description={"Try changing the filters or search term"}
      withIllustration
    />
  );

  const rowMarkup = customers.map(
    ({ id, name, location, orders, amountSpent }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <TextContainer fontWeight="bold" as="span">
            {name}
          </TextContainer>
        </IndexTable.Cell>
        <IndexTable.Cell>{location}</IndexTable.Cell>
        <IndexTable.Cell>
          <TextContainer as="span" alignment="end" numeric>
            {orders}
          </TextContainer>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextContainer as="span" alignment="end" numeric>
            {amountSpent}
          </TextContainer>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Card>
      <IndexTable
        resourceName={resourceName}
        itemCount={customers.length}
        emptyState={emptyStateMarkup}
        headings={[
          { title: "Name" },
          { title: "Location" },
          {
            id: "order-count",
            title: (
              <TextContainer as="span" alignment="end">
                Order count
              </TextContainer>
            ),
          },
          {
            id: "amount-spent",
            title: (
              <TextContainer as="span" alignment="end">
                Amount spent
              </TextContainer>
            ),
          },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
