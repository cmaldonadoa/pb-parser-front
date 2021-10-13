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
        height: 144,
        background: disabled ? "var(--color-1-text)" : "white",
        borderRadius: 5,
        border: "2px solid",
        borderColor: disabled
          ? "var(--detail)"
          : green
          ? "var(--color-2)"
          : "var(--color-1)",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "white" : green ? "var(--color-2)" : "var(--color-1)",
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
          <span
            className="text-sm"
            style={{ color: disabled ? "white" : "#007bff" }}
          >
            {actionTitle}
          </span>
        </Col>
      </Row>
    </div>
  );
}
