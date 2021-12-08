import { Button, Col, Row, Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";
import { DownOutlined } from "@ant-design/icons";

export default function Header({ leftButton, rightButton }) {
  const history = useHistory();
  const [username, setUsername] = useState("");

  useEffect(() => {
    try {
      const jwt = sessionStorage.getItem("auth");
      const decoded = jwt_decode(jwt);
      setUsername(decoded.username);
    } catch {}
  }, []);

  const logOut = () => {
    sessionStorage.removeItem("auth");
    history.push("/");
  };

  const menu = (
    <Menu style={{ borderRadius: 5 }} onClick={logOut}>
      <Menu.Item key="logout">Cerrar sesión</Menu.Item>
    </Menu>
  );

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
          <Row align="middle" gutter={12}>
            {!!username && (
              <Col>
                <Dropdown overlay={menu} placement="bottomRight">
                  <Button
                    type="text"
                    className="text-sm text-bold"
                    style={{ color: "var(--color-1-text)" }}
                  >
                    {username} <DownOutlined className="text-xs" />
                  </Button>
                </Dropdown>
              </Col>
            )}
            <Col style={{ height: "100%" }}>
              <img
                src="/parpro.svg"
                alt="Logo PARPro"
                style={{ maxHeight: "100%", cursor: "pointer" }}
                onClick={() => history.push("/")}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </header>
  );
}
