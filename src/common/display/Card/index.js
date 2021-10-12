import { Col, Row } from "antd";
import React from "react";

export default function Card({
  green,
  title,
  description,
  action,
  actionTitle,
  disabled,
}) {
  return (
    <div
      style={{
        height: 165,
        background: disabled
          ? "var(--color-1-text)"
          : green
          ? "var(--color-2)"
          : "var(--color-1)",
        borderRadius: 5,
        cursor: disabled ? "not-allowed" : "pointer",
        color: "white",
        padding: "18px",
      }}
      onClick={disabled ? () => {} : action}
    >
      <Row style={{ height: "50%" }}>
        <Col className="text-bold">{title}</Col>
      </Row>
      <Row justify="space-between" align="bottom" style={{ height: "50%" }}>
        <Col>{description}</Col>
        <Col>
          <span className="text-sm">{actionTitle}</span>
        </Col>
      </Row>
    </div>
  );
}
