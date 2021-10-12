import { Steps } from "antd";
import React from "react";

const { Step } = Steps;

export default function FormSteps({ currentStep, steps, style }) {
  return (
    <Steps
      current={currentStep}
      labelPlacement="vertical"
      style={{ marginTop: 48, marginBottom: 48, ...style }}
    >
      {steps.map((s, i) => (
        <Step
          key={i}
          title={
            <span
              style={{
                paddingTop: 24,
                color:
                  currentStep < i ? "var(--color-1-text)" : "var(--color-1)",
              }}
              className="text-sm text-bold"
            >
              {s}
            </span>
          }
          disabled={currentStep < i}
        />
      ))}
    </Steps>
  );
}
