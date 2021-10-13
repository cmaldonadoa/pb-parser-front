import { Col, Radio, Row } from "antd";
import React from "react";
import Button from "../Button";

export default function RadioInput({
  name,
  label,
  options,
  values,
  onChange,
  button,
  green,
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
      {button ? (
        <Row gutter={24}>
          {options.map((e, i) => (
            <Col key={i}>
              <Button
                green={green}
                outline
                onClick={() => onChange(getArg(e.value))}
                disabled={disabled || e.value === values[name]}
              >
                {e.label}
              </Button>
            </Col>
          ))}
        </Row>
      ) : (
        <Radio.Group
          disabled={disabled}
          value={values[name]}
          style={{ width: "100%", marginTop: 6 }}
          onChange={(e) => onChange(getArg(e.target.value))}
          options={options}
        />
      )}
    </div>
  );
}
