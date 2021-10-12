import { Button, Col, Row } from "antd";
import React from "react";
import { useHistory } from "react-router";

const TextButton = ({ children }) => {
  return (
    <Button
      type="text"
      className="text-sm text-bold"
      style={{ color: "var(--color-1-text)" }}
    >
      {children}
    </Button>
  );
};

export default function Header({ leftButton, rightButton }) {
  const history = useHistory();
  return (
    <header
      style={{
        height: "var(--height-header)",
        background: "var(--color-bg-main)",
        boxShadow: "0 3px 5px rgba(0,0,0,.25)",
        borderBottom: "3px solid var(--color-1)",
        position: "fixed",
        width: "100vw",
        top: 0,
        zIndex: 1000,
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
        align="middle"
      >
        <Col style={{ height: "100%" }}>
          <img
            src="/minvu.svg"
            alt="Logo MINVU"
            style={{ maxHeight: "100%", cursor: "pointer" }}
            onClick={() => history.push("/")}
          />
        </Col>
        <Col>
          <TextButton onClick={leftButton.onClick}>
            {leftButton.content}
          </TextButton>
        </Col>
        <Col>
          <TextButton onClick={rightButton.onClick}>
            {rightButton.content}
          </TextButton>
        </Col>
        <Col style={{ height: "100%" }}>
          <img
            src="/parpro.svg"
            alt="Logo PARPro"
            style={{ maxHeight: "100%" }}
          />
        </Col>
      </Row>
    </header>
  );
}
