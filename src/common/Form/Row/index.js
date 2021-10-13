import { Col, Row } from "antd";
import React from "react";

export default function FormRow({
  children,
  values,
  onChange,
  justify,
  align,
}) {
  return (
    <Row gutter={24} wrap={false} justify={justify} align={align}>
      {React.Children.map(
        children,
        (e, i) =>
          React.isValidElement(e) && (
            <Col
              key={i}
              flex={e.props.flex}
              span={e.props.span}
              offset={e.props.offset}
            >
              {React.cloneElement(e, { onChange, values })}
            </Col>
          )
      )}
    </Row>
  );
}
