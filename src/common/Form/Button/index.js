import { Button } from "antd";
import React from "react";

export default function FilledButton({
  children,
  green,
  to,
  onClick,
  outline,
  disabled,
  selected,
  label,
  name,
  loading,
}) {
  return (
    <>
      <label
        className="text-sm"
        style={{ color: "var(--color-2-text)" }}
        htmlFor={name}
      >
        {label}
      </label>
      <Button
        ref={(node) =>
          node && node.style.setProperty("padding-top", "3.3px", "important")
        }
        loading={loading}
        disabled={disabled}
        size="large"
        className="text-bold text-sm button-padding"
        type={outline && !selected ? "default" : "primary"}
        danger={green}
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: 5,
          marginTop: !!label && 6,
        }}
        onClick={onClick}
        href={to}
      >
        {children}
      </Button>
    </>
  );
}
