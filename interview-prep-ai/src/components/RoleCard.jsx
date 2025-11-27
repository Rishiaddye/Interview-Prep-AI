import { useTheme } from "../context/themeContext";
import React from "react";

const RoleCard = ({ role, onClick, onDelete }) => {
  const { theme } = useTheme();
  const isCustom = role.isCustom === true;

  return (
    <div
      style={{
        position: "relative",
        padding: "26px",
        borderRadius: "22px",
        background: role.bg || "var(--card)",
        cursor: "pointer",
        boxShadow:
          theme === "dark"
            ? "0 4px 12px rgba(255,255,255,0.05)"
            : "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow =
          theme === "dark"
            ? "0 12px 30px rgba(255,255,255,0.16)"
            : "0 12px 25px rgba(0,0,0,0.18)";
        const delBtn = e.currentTarget.querySelector(".delete-btn");
        if (delBtn) {
          delBtn.style.opacity = "1";
          delBtn.style.transform = "translateY(0)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          theme === "dark"
            ? "0 4px 12px rgba(255,255,255,0.05)"
            : "0 4px 12px rgba(0,0,0,0.08)";
        const delBtn = e.currentTarget.querySelector(".delete-btn");
        if (delBtn) {
          delBtn.style.opacity = "0";
          delBtn.style.transform = "translateY(-6px)";
        }
      }}
    >
      {/* 🔥 Delete Button */}
      {isCustom && (
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this role?")) onDelete();
          }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "#ff4d4d",
            border: "none",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            cursor: "pointer",
            fontSize: "15px",
            opacity: 0,
            transform: "translateY(-6px)",
            transition: "all 0.25s ease",
            zIndex: 10,
          }}
        >
          🗑
        </button>
      )}

      {/* Code Bubble */}
      <div
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "20px",
          marginBottom: "18px",
          color: "#333",
        }}
      >
        {role.code}
      </div>

      {/* 🔥 Title + NEW Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            color: theme === "dark" ? "#1b1b1b" : "#222", // 🔥 DARK TEXT in both modes
          }}
        >
          {role.title}
        </h3>

        {/* 🔥 NEW BADGE (only for custom roles) */}
        {isCustom && (
          <span
            style={{
              padding: "3px 10px",
              fontSize: "11px",
              fontWeight: 700,
              borderRadius: "12px",
              background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
              color: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              letterSpacing: "0.5px",
              transform: "translateY(-2px)",
            }}
          >
            NEW
          </span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          margin: "10px 0 18px",
          opacity: 0.85,
          color: theme === "dark" ? "#2a2a2a" : "#555", // 🔥 DARK TEXT
          fontSize: 14,
        }}
      >
        {role.desc}
      </p>

      {/* Experience */}
      <p
        style={{
          margin: "4px 0",
          fontWeight: 500,
          color: theme === "dark" ? "#1b1b1b" : "#333", // 🔥 DARK TEXT
        }}
      >
        Experience:{" "}
        <span style={{ fontWeight: 700 }}>{role.exp}</span>
      </p>

      {/* Updated */}
      <p
        style={{
          margin: 0,
          fontWeight: 500,
          color: theme === "dark" ? "#1b1b1b" : "#333", // 🔥 DARK TEXT
        }}
      >
        Updated:{" "}
        <span style={{ fontWeight: 700 }}>{role.updated}</span>
      </p>
    </div>
  );
};

export default RoleCard;