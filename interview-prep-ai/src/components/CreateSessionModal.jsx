import { useState } from 'react';
import { createSession as apiCreateSession } from "../apis/sessionApi.js";
import { createSession as fallbackCreate } from "../utils/aiService.js";
import { useNavigate } from "react-router-dom";

// -------------------------------
// ⭐ Save session correctly to history
// -------------------------------
function saveSessionToHistory(id, role, experience, topics) {
  let history = JSON.parse(localStorage.getItem("sessionHistory") || "[]");

  const entry = {
    id,
    role,
    experience,
    topics,
    date: new Date().toISOString(),
  };

  history.unshift(entry);

  // Keep last 15 only
  localStorage.setItem("sessionHistory", JSON.stringify(history.slice(0, 15)));
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1200,
};

const boxStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "560px",
  maxWidth: "94%",
};

const CreateSessionModal = ({ role, close }) => {
  const [experience, setExperience] = useState("");
  const [topics, setTopics] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const create = async () => {
    setLoading(true);

    try {
      let session = await apiCreateSession({
        role: role.title,
        experience,
        topics,
        description: "",
      });

      if (session?.data) session = session.data;

      setLoading(false);

      const id =
        session?._id ||
        session?.id ||
        session?.session?._id ||
        session?.session?.id;

      if (!id) {
        alert("❌ No session ID returned.");
        console.log("SERVER RESPONSE:", session);
        return;
      }

      // Save history correctly
      saveSessionToHistory(id, role.title, experience, topics);

      close();
      navigate(`/interview-prep/${id}`);
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Failed to create session");
    }
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h3 style={{ marginTop: 0, color: "#1b1b1b", fontSize: 18, fontWeight: 700 }}>
          Start New Interview Journey
        </h3>
        <strong style={{ color: "#1b1b1b", fontSize: 16, display: "block", marginBottom: 12 }}>
          {role?.title}
        </strong>

        {/* Years of Experience */}
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#1b1b1b", fontWeight: 600, fontSize: 13 }}>
            Years of Experience
          </label>
          <input
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g. 3"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              color: "#1b1b1b",
              backgroundColor: "#f9f9f9",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Topics */}
        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#1b1b1b", fontWeight: 600, fontSize: 13 }}>
            Topics (comma separated)
          </label>
          <input
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="Docker, Kubernetes, CI/CD"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              color: "#1b1b1b",
              backgroundColor: "#f9f9f9",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
          <button
            onClick={close}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
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
              background: "linear-gradient(90deg,#FF9324,#FCD760)",
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              color: "white",
              fontWeight: 600,
              minWidth: 140,
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
};

export default CreateSessionModal;