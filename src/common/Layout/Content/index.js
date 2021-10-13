import { Col, Row } from "antd";
import React from "react";

export default function Content({ children }) {
  return (
    <main
      style={{
        paddingTop: "var(--height-header)",
      }}
    >
      <Row
        className="container"
        style={{
          background: "var(--color-bg-main)",
          minHeight:
            "calc(100vh - var(--height-footer) - var(--height-header))",
          overflow: "hidden",
          marginRight: "auto",
          marginLeft: "auto",
          paddingTop: 25,
          paddingBottom: 25,
        }}
        justify="center"
      >
        <Col style={{ width: "100%" }}>{children}</Col>
      </Row>
    </main>
  );
}
