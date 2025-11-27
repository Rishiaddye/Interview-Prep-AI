import React, { useState, useEffect } from "react";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import { Sun, Moon, Menu, X } from "lucide-react";
import HistoryMenu from "./HistoryMenu";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // 🔥 CLOSE MENU WHEN RESIZING TO LARGE SCREEN
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        width: "100%",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#FFFCEF",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 2000,
        transition: "background 0.35s ease",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* LOGO */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img src="/logo.png" alt="logo" style={{ width: 40, height: 40 }} />
        <h1 className="text-xl font-bold hidden sm:block" style={{ color: "#0F0F0F" }}>
          Interview Prep AI
        </h1>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-5 flex-wrap justify-end">
        {/* 🔥 THEME TOGGLE BUTTON - Always Light */}
        <button
          onClick={toggleTheme}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.35s ease",
          }}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon size={20} color="#0F0F0F" />
          ) : (
            <Sun size={20} color="#FF9324" />
          )}
        </button>

        <HistoryMenu open={historyOpen} setOpen={setHistoryOpen} />

        <div style={{ textAlign: "right", fontSize: 14, color: "#0F0F0F" }}>
          <p style={{ margin: 0, opacity: 0.6, color: "#4B4B4B" }}>
            Member
          </p>
          <p style={{ margin: 0, fontWeight: 600, color: "#0F0F0F" }}>
            {user?.fullName}
          </p>
        </div>

        <img
          src={user?.profilePic || "https://i.ibb.co/4pDNDk1/avatar.png"}
          alt="avatar"
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #ff9e3c",
            cursor: "pointer",
          }}
        />

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#d87a2f",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔥 MOBILE MENU TOGGLE */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex items-center justify-center"
        style={{
          width: 40,
          height: 40,
          borderRadius: "8px",
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#fff",
          color: "#0F0F0F",
          cursor: "pointer",
        }}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🔥 MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            left: 0,
            background: "#FFFCEF",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <style>
            {`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>

          {/* Theme Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {theme === "light" ? (
                <Moon size={20} color="#0F0F0F" />
              ) : (
                <Sun size={20} color="#FF9324" />
              )}
            </button>
            <span style={{ color: "#0F0F0F", fontWeight: 500 }}>
              {theme === "light" ? "Light Mode" : "Dark Mode"}
            </span>
          </div>

          {/* History Menu - Mobile Version */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <HistoryMenu open={historyOpen} setOpen={setHistoryOpen} />
            <span style={{ color: "#0F0F0F", fontWeight: 500 }}>
              Recent Sessions
            </span>
          </div>

          {/* User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={user?.profilePic || "https://i.ibb.co/4pDNDk1/avatar.png"}
              alt="avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ff9e3c",
              }}
            />
            <div>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.6, color: "#4B4B4B" }}>
                Member
              </p>
              <p style={{ margin: 0, fontWeight: 600, color: "#0F0F0F" }}>
                {user?.fullName}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate("/");
              setMenuOpen(false);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#d87a2f",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              padding: "8px 0",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;