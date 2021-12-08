import React from "react";

export default function Form({ children, values, onChange, onSubmit }) {
  return (
    <div onKeyDown={(e) => e.key === "Enter" && onSubmit()}>
      {React.Children.map(
        children,
        (e) =>
          React.isValidElement(e) && React.cloneElement(e, { onChange, values })
      )}
    </div>
  );
}
