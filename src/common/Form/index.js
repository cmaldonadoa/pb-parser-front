import React from "react";

export default function Form({ children, values, onChange }) {
  return (
    <div>
      {React.Children.map(
        children,
        (e) =>
          React.isValidElement(e) && React.cloneElement(e, { onChange, values })
      )}
    </div>
  );
}
