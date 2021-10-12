import { Col, Row } from "antd";
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        height: "var(--height-footer)",
        background: "var(--color-bg-footer)",
      }}
    >
      <Row
        className="container"
        style={{
          height: "100%",
          marginRight: "auto",
          marginLeft: "auto",
          paddingTop: 25,
          paddingBottom: 25,
        }}
        justify="space-between"
      >
        <Col style={{ height: "100%" }}>
          <img
            src="/corfo.svg"
            alt="Logo CORFO"
            style={{ maxHeight: "100%" }}
          />
        </Col>
        <Col style={{ height: "100%" }}>
          <img
            src="https://via.placeholder.com/200/"
            alt="Logo VelociTI"
            style={{ maxHeight: "100%" }}
          />
        </Col>
        <Col style={{ height: "100%" }}>
          <img
            src="/planbim.svg"
            alt="Logo PlanBIM"
            style={{ maxHeight: "100%" }}
          />
        </Col>
      </Row>
    </footer>
  );
}
