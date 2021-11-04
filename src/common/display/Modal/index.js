import {
  CheckCircleFilled,
  CloseCircleFilled,
  CloseOutlined,
} from "@ant-design/icons";
import React from "react";

function Modal({ open, title, icon, onClose }) {
  return (
    <div
      style={{
        visibility: open ? "visible" : "hidden",
      }}
    >
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
        onClick={onClose}
      >
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
            opacity: open ? 1 : 0,
            transition: "all 200ms ease",
          }}
        >
          {!!onClose && (
            <CloseOutlined
              className="text-l"
              onClick={onClose}
              style={{
                color: "var(--color-1-text)",
                right: 12,
                top: 12,
                position: "absolute",
              }}
            />
          )}
          {icon}
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
    </div>
  );
}

function SuccessModal({ open, title }) {
  return (
    <Modal
      open={open}
      title={title}
      icon={
        <CheckCircleFilled
          className="text-xl"
          style={{ color: "var(--color-1)" }}
        />
      }
    />
  );
}

function ErrorModal({ open, title, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      icon={
        <CloseCircleFilled
          className="text-xl"
          style={{ color: "var(--color-3)" }}
        />
      }
    />
  );
}
export { SuccessModal, ErrorModal };
