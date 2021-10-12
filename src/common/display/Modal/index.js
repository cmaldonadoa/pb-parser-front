import { CheckCircleFilled } from "@ant-design/icons";
import React from "react";

export default function SuccessModal({ open, title }) {
  return (
    <div style={{ display: open ? "block" : "none" }}>
      <div
        style={{
          zIndex: 2000,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.45)",
        }}
      />
      <div
        className="text-center"
        style={{
          zIndex: 2001,
          position: "fixed",
          top: "calc(50% - 125px)",
          left: "calc(50% - 275px)",
          padding: 55,
          background: "white",
          height: 250,
          width: 550,
          color: "var(--color-1)",
        }}
      >
        <CheckCircleFilled
          className="text-xl"
          style={{ color: "var(--color-1)" }}
        />
        <p className="text-bold" style={{ marginTop: 28, fontSize: 24 }}>
          {title}
        </p>
        <div
          style={{
            zIndex: 2001,
            position: "fixed",
            top: "calc(50% + 125px)",
            left: "calc(50% - 275px)",
            height: 10,
            background: "var(--color-1)",
            width: 175,
          }}
        />
        <div
          style={{
            zIndex: 2001,
            position: "fixed",
            top: "calc(50% + 125px)",
            left: "calc(50% - 100px)",
            height: 10,
            background: "#A94442",
            width: 375,
          }}
        />
      </div>
    </div>
  );
}
