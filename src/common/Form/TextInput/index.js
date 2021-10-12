import { Checkbox, Input, Tag } from "antd";
import React from "react";

export default function TextInput({
  name,
  label,
  placeholder,
  startIcon,
  endIcon,
  type,
  disabled,
  multiple,
  onChange,
  values,
  onDelete,
  required,
  activable,
}) {
  const tags =
    !!multiple && multiple.length > 0 ? (
      <>
        {multiple.map((e, i) => (
          <Tag key={i} onClose={() => onDelete(e)} closable>
            {e}
          </Tag>
        ))}
      </>
    ) : (
      <span />
    );

  const getArg = (value) => {
    const arg = {};
    arg[name] = value;
    return arg;
  };

  const getArgCheckbox = (value) => {
    const arg = {};
    arg[activable] = value;
    return arg;
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label
        className="text-sm"
        style={{ color: "var(--color-2-text)" }}
        htmlFor={name}
      >
        {!!activable && (
          <>
            <Checkbox
              disabled={disabled}
              checked={values[activable]}
              onChange={(e) => onChange(getArgCheckbox(e.target.checked))}
              style={{ marginRight: 8 }}
            />
          </>
        )}
        {label}{" "}
        {required && (
          <span className="text-bold" style={{ color: "var(--color-3)" }}>
            *
          </span>
        )}
      </label>
      <Input
        value={values[name]}
        disabled={disabled || (activable !== undefined && !values[activable])}
        placeholder={placeholder}
        prefix={tags || startIcon}
        suffix={endIcon}
        type={type}
        style={{ borderRadius: 5, marginTop: 6 }}
        onChange={(e) => onChange(getArg(e.target.value))}
        onBlur={(e) =>
          !!multiple &&
          e.target.value.length > 0 &&
          onChange(getArg(e.target.value + ","))
        }
      />
    </div>
  );
}
