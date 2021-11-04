import { Checkbox, Input, Tag, AutoComplete } from "antd";
import React, { useState } from "react";

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
  options,
}) {
  const tags =
    !!multiple && multiple.length > 0 ? (
      <>
        {multiple.map((e, i) => (
          <Tag
            key={i}
            onClose={(event) => {
              event.preventDefault();
              onDelete(e);
            }}
            closable
          >
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

  const CustomInput = (
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
  );

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

      {!!options ? (
        <AutoComplete
          value={values[name]}
          style={{ borderRadius: 5, marginTop: 6, width: "100%" }}
          options={options.map((e) => ({
            label: !!multiple && multiple.includes(e) ? <b>{e}</b> : e,
            value: e,
          }))}
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={(value, option) => {
            onChange(getArg(value + ","));
            !!multiple && multiple.includes(value) && onDelete(value);
          }}
        >
          {CustomInput}
        </AutoComplete>
      ) : (
        CustomInput
      )}
    </div>
  );
}
