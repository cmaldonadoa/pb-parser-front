import React, { useState, useEffect } from "react";

import { useRouteMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import { Menu, Button } from "antd";

import "./index.scss";

const keySwitch = {
  "/": "home",
  "/upload": "upload",
};

export default function HeaderMenu({ onClick }) {
  const match = useRouteMatch();
  const k = keySwitch[match.path];
  const [enabled, setEnabled] = useState(k === "home");
  const [key, setKey] = useState(k);

  return (
    <>
      {enabled && (
        <div className="HeaderMenu-ButtonGroup">
          <Button type="primary" shape="round" onClick={onClick}>
            Nueva Regla
          </Button>
        </div>
      )}

      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[key]}>
        <Menu.Item key="home">
          <Link to="/">Reglas</Link>
        </Menu.Item>
        <Menu.Item key="upload">
          <Link to="/upload">Validador</Link>
        </Menu.Item>
      </Menu>
    </>
  );
}
