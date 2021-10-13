import { Select } from "antd";
import React from "react";

const { Option } = Select;

export default function SelectInput({
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
      <Select
        disabled={disabled}
        style={{ borderRadius: 5, width: "100%", marginTop: 6 }}
        onChange={(e) => onChange(getArg(e))}
        value={values[name]}
      >
        {options.map((o, i) => (
          <Option key={i} value={o.value}>
            {o.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
