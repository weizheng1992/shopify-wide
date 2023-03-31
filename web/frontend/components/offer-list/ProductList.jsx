import { useNavigate, ContextualSaveBar } from "@shopify/app-bridge-react";
import {
  Card,
  IndexTable,
  Pagination,
  ButtonGroup,
  Button,
} from "@shopify/polaris";
import dayjs from "dayjs";
import { useState } from "react";

export default function ProductList({
  list,
  hasNextPage,
  hasPreviousPage,
  loading,
  currentPage,
  onPageChange,
}) {
  const [deleteOffer, setDeleteOffer] = useState(false);
  const navigate = useNavigate();

  // const isSmallScreen = useMedia("(max-width: 640px)");

  const resourceName = {
    singular: "Offer",
    plural: "Offer",
  };

  const handleToggleBar = () => {
    setDeleteOffer((prev) => !prev);
  };

  const handleToEdit = (id) => {
    navigate(`/product/${encodeURIComponent(id)}`);
  };

  const rowMarkup = list.map(({ _id, title, createdAt, productId }, index) => {
    return (
      <IndexTable.Row id={_id} key={_id} position={index}>
        <IndexTable.Cell>
          {truncate(title, 25)}
          {/* </UnstyledLink> */}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {dayjs(createdAt).format("MMMM D, YYYY")}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button primary onClick={() => handleToEdit(productId)}>
              Edit
            </Button>
            <Button destructive onClick={handleToggleBar}>
              Delete
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });
  console.log(deleteOffer);
  /* A layout for small screens, built using Polaris components */
  return (
    <Card>
      <IndexTable
        resourceName={resourceName}
        itemCount={list.length}
        headings={[
          { title: "Title" },
          { title: "Date created" },
          { title: "Options" },
        ]}
        selectable={false}
        loading={loading}
      >
        {rowMarkup}
      </IndexTable>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          padding: "1rem 0",
        }}
      >
        <Pagination
          hasPrevious={hasPreviousPage}
          onPrevious={() => onPageChange(currentPage - 1)}
          hasNext={hasNextPage}
          onNext={() => onPageChange(currentPage + 1)}
        />
      </div>
    </Card>
  );
}

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}
