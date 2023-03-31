import React, { useEffect, useState, useCallback } from "react";
import { Autocomplete, Page, Card, Icon } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useNavigate } from "@shopify/app-bridge-react";
import { useAuthenticatedFetch } from "../../hooks";

const SearchBar = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [cursor, setCursor] = useState("");
  const navigate = useNavigate();

  const fetch = useAuthenticatedFetch();

  const handleFetchProducts = useCallback(async () => {
    setIsLoading(true);
    const query_params = new URLSearchParams({
      limit: 10,
      title: inputValue,
      page: cursor,
    });
    const response = await fetch(`/api/product/list?${query_params}`);

    const { products: fetchedProducts } = await response.json();
    const list = fetchedProducts.nodes.map((item) => {
      return {
        value: item.id,
        label: item.title,
      };
    });
    setProducts((prevProducts) =>
      !cursor
        ? list
        : [...prevProducts, ...list]
    );

    setPageInfo(fetchedProducts.pageInfo);
    setIsLoading(false);
  }, [cursor, inputValue]);

  useEffect(() => {
    handleFetchProducts();
  }, [handleFetchProducts]);

  const handleLoadMoreResults = () => {
    if (pageInfo?.hasNextPage) {
      setCursor(pageInfo.endCursor);
    }
  };

  const updateText = (value) => {
    setInputValue(value);
    setCursor("");
  };

  const updateSelection = (selected) => {
    const selectedValue = selected.map((selectedItem) => {
      const matchedOption = products.find((option) => {
        return option.value.match(selectedItem);
      });
      return matchedOption && matchedOption.label;
    });

    setSelectedOptions(selected);
    setInputValue(selectedValue[0] || "");
  };

  const handleSave = () => {
    navigate(`/product/new?id=${selectedOptions}`);
  };

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Tags"
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
      autoComplete="off"
    />
  );
  return (
    <Page narrowWidth>
      <Card
        sectioned
        primaryFooterAction={{ content: "Save", onAction: handleSave }}
      >
        <Autocomplete
          options={products}
          selected={selectedOptions}
          onSelect={updateSelection}
          textField={textField}
          loading={isLoading}
          onLoadMoreResults={handleLoadMoreResults}
          willLoadMoreResults={pageInfo?.hasNextPage}
        />
      </Card>
    </Page>
  );
};

export default SearchBar;
