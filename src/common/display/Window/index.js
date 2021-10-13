import React from "react";

export default function Window({ title, children }) {
  return (
    <div>
      <div
        className="text-sm text-bold"
        style={{
          background: "var(--color-1)",
          borderTopRightRadius: 5,
          borderTopLeftRadius: 5,
          padding: "6px 18px",
          color: "white",
          left: 0,
          top: 0,
          width: "100%",
        }}
      >
        {title}
      </div>

      <div
        style={{
          background: "var(--color-bg-footer)",
          borderRadius: 5,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          padding: "25px 18px",
          border: "1px solid var(--detail)",
          marginBottom: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}
