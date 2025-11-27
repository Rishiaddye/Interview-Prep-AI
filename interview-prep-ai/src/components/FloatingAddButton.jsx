// src/components/FloatingAddButton.jsx
import React from "react";

const FloatingAddButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        background: "#ff8c2a",
        color: "#fff",
        border: "none",
        padding: "18px 28px",
        borderRadius: "50px",
        fontSize: "18px",
        fontWeight: "600",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "all 0.25s ease",   // smooth animation
      }}

      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
      }}

      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "white",
          color: "#ff8c2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: "700",
        }}
      >
        +
      </span>
      Add New
    </button>
  );
};

export default FloatingAddButton;
