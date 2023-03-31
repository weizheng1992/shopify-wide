import { Card, TextContainer } from "@shopify/polaris";
import { memo, useState } from "react";

function RightView({ heading, list }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="right-view">
      <Card sectioned title="Preview offers">
        <TextContainer>{heading}</TextContainer>
        {list.map((item, index) => (
          <div
            className={`view-offer ${selected === index ? "selected" : ""}`}
            key={index}
            onClick={() => setSelected(index)}
          >
            <img src="https://cdn.shopify.com/s/files/1/0275/7646/7549/products/t-shirt-11_360x.jpg?v=1679293225" />
            <div className="offer-info">
              <h4>{item.title}</h4>
              <p>${item.price}</p>
              <div className="options-list">
                {item?.list?.map((op) => (
                  <div className="option-item">
                    <label>{op.optionsName}</label>
                    <select placeholder={op.optionsName}>
                      {op.optionsTags.map((vl) => (
                        <option key={vl} value={vl}>
                          {vl}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default memo(RightView);
