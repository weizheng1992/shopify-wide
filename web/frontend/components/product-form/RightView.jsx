import { Card, TextContainer } from "@shopify/polaris";
import { memo } from "react";

function RightView({ heading, list }) {
  return (
    <div
      style={{
        position: "fixed",
        right: "20px",
        width: "calc(30% - 40px)",
        top: "30%",
      }}
    >
      <Card sectioned title="Preview offers">
        <TextContainer>{heading}</TextContainer>
        {list.map((item) => (
          <div className="view-offer" key={item.id}>
            <h4>{item.title}</h4>
            <p>${item.price}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default memo(RightView);
