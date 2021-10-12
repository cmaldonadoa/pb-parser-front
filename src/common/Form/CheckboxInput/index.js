import { Checkbox } from "antd";
import React from "react";

export default function CheckboxInput({
  name,
  label,
  options,
  values,
  onChange,
  required,
  disabled,
}) {
  const getArg = (value) => {
    const arg = {};
    arg[name] = value;
    return arg;
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label
        className="text-sm"
        style={{ color: "var(--color-2-text)" }}
        htmlFor={name}
      >
        {label}{" "}
        {required && (
          <span className="text-bold" style={{ color: "var(--color-3)" }}>
            *
          </span>
        )}
      </label>
      <Checkbox.Group
        disabled={disabled}
        value={values[name]}
        style={{ width: "100%", marginTop: 6 }}
        options={options}
        onChange={(e) => onChange(getArg(e))}
      />
    </div>
  );
}
