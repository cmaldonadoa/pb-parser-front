import { Button } from "antd";
import React from "react";

export default function IconButton({ icon, green, label, onClick, style }) {
  return (
    <div style={{ cursor: "pointer", ...style }} onClick={onClick}>
      <Button
        danger={green}
        type={green ? "default" : "primary"}
        shape="circle"
        icon={icon}
      />
      <Button danger={green} className="text-bold" type="link">
        {label}
      </Button>
    </div>
  );
}
