import { useState } from 'react';
import { createSession as apiCreateSession } from "../apis/sessionApi.js";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeContext";

// Soft colors
function generateSoftColor() {
  const pastel = [
    "#fff3e6",
    "#e6f7ff",
    "#e6ffe6",
    "#fff0f5",
    "#f0f5ff",
    "#f9fbe7",
    "#fef7e0",
    "#e8f5e9",
    "#f3e5f5",
  ];
  return pastel[Math.floor(Math.random() * pastel.length)];
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const box = {
  background: "#fff",
  padding: "32px",
  borderRadius: 14,
  width: "520px",
  maxWidth: "95%",
  boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
};

const label = {
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
  color: "#1b1b1b", // 🔥 Dark text
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 14,
  outline: "none",
  backgroundColor: "#f9f9f9", // 🔥 Light background
  color: "#1b1b1b", // 🔥 Dark text
};

export default function CreateSessionModalAddNew({ close }) {
  const { theme } = useTheme();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [topics, setTopics] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const create = async () => {
    setLoading(true);
    try {
      const session = await apiCreateSession({
        role,
        experience,
        topics,
        description,
      });
      const id = session?._id || session?.id || session?.session?._id || session?.session?.id;
      const newRole = {
        code: role.slice(0, 2).toUpperCase(),
        title: role,
        desc: topics || description || "Custom Role",
        exp: experience + " Years",
        updated: new Date().toLocaleDateString(),
        bg: generateSoftColor(),
        isCustom: true,
      };
      let savedRoles = JSON.parse(localStorage.getItem("customRoles") || "[]");
      savedRoles.push(newRole);
      localStorage.setItem("customRoles", JSON.stringify(savedRoles));

      // ⭐ ADD TO HISTORY
      const history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");
      history.unshift({
        id,
        role,
        experience,
        topics,
        date: Date.now(),
      });
      localStorage.setItem("sessionHistory", JSON.stringify(history));
      setLoading(false);
      if (!id) {
        alert("Session ID missing!");
        return;
      }
      close();
      navigate(`/interview-prep/${id}`);
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Failed to create session.");
    }
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1b1b1b" }}>
          Start a New Custom Interview Journey
        </h2>
        <p style={{ color: "#555", marginTop: 6 }}>
          Enter details to create your custom interview prep set.
        </p>

        {/* Role */}
        <div style={{ marginTop: 18 }}>
          <label style={label}>Role</label>
          <input
            style={input}
            placeholder="e.g. Data Scientist"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        {/* Years of Experience */}
        <div style={{ marginTop: 16 }}>
          <label style={label}>Years of Experience</label>
          <input
            style={input}
            placeholder="e.g. 5"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>

        {/* Topics */}
        <div style={{ marginTop: 16 }}>
          <label style={label}>Topics (comma separated)</label>
          <input
            style={input}
            placeholder="Python, SQL, Data Cleaning"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
          />
        </div>

        {/* Description */}
        <div style={{ marginTop: 16 }}>
          <label style={label}>Description</label>
          <textarea
            rows={3}
            style={{ ...input, resize: "none" }}
            placeholder="Preparing for advanced roles…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 22,
          }}
        >
          <button
            onClick={close}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
              color: "#1b1b1b",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={create}
            disabled={loading}
            style={{
              padding: "10px 16px",
              minWidth: 140,
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg,#FF9324,#FCD760)",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
}