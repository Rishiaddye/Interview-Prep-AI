import { useTheme } from "../context/themeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "light" ? "#ffe8c2" : "#1a1a1a",
        color: theme === "light" ? "#000" : "#ffcc75",
        padding: "10px 14px",
        borderRadius: "50%",
        border: "1px solid #ccc",
        cursor: "pointer",
        transition: "0.3s ease",
      }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
