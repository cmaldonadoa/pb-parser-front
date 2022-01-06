import { Button } from "antd";
import React, { useState } from "react";
import { useHistory } from "react-router";

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
  const history = useHistory();
  const [selfDisabled, setSelfDisabled] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!selfDisabled) {
      setSelfDisabled(true);
      onClick(() => setSelfDisabled(false));
    }
  };

  return (
    <>
      {!!label && (
        <label
          className="text-sm"
          style={{ color: "var(--color-2-text)" }}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <Button
        ref={(node) =>
          node && node.style.setProperty("padding-top", "3.3px", "important")
        }
        loading={loading}
        disabled={disabled || selfDisabled}
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
        onClick={to ? () => history.push(to) : handleClick}
      >
        {children}
      </Button>
    </>
  );
}
