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
        align="stretch"
      >
        <Col
          flex="auto"
          style={{
            height: "100%",
            justifyContent: "start",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/corfo.svg"
            alt="Logo CORFO"
            style={{ maxHeight: "100%", maxWidth: 150 }}
          />
        </Col>
        <Col
          flex="auto"
          style={{
            height: "100%",
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/velociti.svg"
            alt="Logo VelociTI"
            style={{ maxHeight: "100%", maxWidth: 150 }}
          />
        </Col>
        <Col
          flex="auto"
          style={{
            height: "100%",
            justifyContent: "end",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/planbim.svg"
            alt="Logo PlanBIM"
            style={{ maxHeight: "100%", maxWidth: 150 }}
          />
        </Col>
      </Row>
    </footer>
  );
}
