import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2 } from "lucide-react";

const HistoryMenu = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // listen to storage changes globally
  useEffect(() => {
    const syncHistory = () => {
      let saved = JSON.parse(localStorage.getItem("sessionHistory") || "[]");

      // 🔥 Remove duplicates ALWAYS (not only when opened)
      const unique = [
        ...new Map(saved.map(item => [item.id, item])).values(),
      ];

      // sort by newest
      const sorted = unique.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // overwrite cleaned version
      localStorage.setItem("sessionHistory", JSON.stringify(sorted));
      setHistory(sorted);
    };

    syncHistory();

    window.addEventListener("storage", syncHistory);
    return () => window.removeEventListener("storage", syncHistory);
  }, []);

  useEffect(() => {
    if (open) {
      let saved = JSON.parse(localStorage.getItem("sessionHistory") || "[]");

      const unique = [
        ...new Map(saved.map((item) => [item.id, item])).values(),
      ];

      const sorted = unique.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setHistory(sorted);
    }
  }, [open]);

  const deleteEntry = (index) => {
    const updated = history.filter((_, i) => i !== index);
    localStorage.setItem("sessionHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  const clearAll = () => {
    localStorage.removeItem("sessionHistory");
    setHistory([]);
  };

  return (
    <div>
      <button
        id="history-trigger"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          border: "1px solid rgba(0,0,0,0.2)",
          background: "var(--card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Clock size={20} color={open ? "var(--text)" : "#ff8c2a"} />
      </button>

      {open && (
        <>
          {isMobile && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.2)",
                zIndex: 2000,
              }}
              onClick={() => setOpen(false)}
            />
          )}

          <div
            style={{
              position: isMobile ? "fixed" : "absolute",
              top: isMobile ? "70px" : "calc(100% + 10px)",
              right: isMobile ? "16px" : 0,
              width: 320,
              maxHeight: isMobile ? "60vh" : 450,
              background: "var(--card)",  // ✅ DARK MODE FIX
              borderRadius: 14,
              boxShadow: "0 14px 40px rgba(0,0,0,0.15)",
              padding: 16,
              zIndex: 3001,
              animation: "fadeIn 0.2s ease-out",
              border: "1px solid var(--border)",   // ✅ THEME BORDER
              display: "flex",
              flexDirection: "column",
              color: "var(--text)",  // ✅ TEXT COLOR SUPPORT
              transition: "all 0.25s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>
              {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
            </style>

            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 14,
                display: "flex",
                justifyContent: "space-between",
                color: "var(--text)", // ensure header respects theme
              }}
            >
              Recent Sessions

              {history.length > 0 && (
                <button
                  onClick={clearAll}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#E74C3C",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            <div
              style={{
                maxHeight: isMobile ? "calc(60vh - 100px)" : 350,
                overflowY: "auto",
                paddingRight: 6,
              }}
              className="custom-scrollbar"
            >
              {history.length === 0 ? (
                <p style={{ opacity: 0.6, margin: 0, color: "var(--text)" }}>
                  No history found
                </p>
              ) : (
                history.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/interview-prep/${item.id}`);
                      setOpen(false);
                    }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: "var(--bg)",   // ✅ FIXED FOR DARK MODE
                      marginBottom: 10,
                      cursor: "pointer",
                      border: "1px solid var(--border)",
                      transition: "all 0.2s ease",
                      paddingRight: 36,
                      position: "relative",
                      color: "var(--text)",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {item.role}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {item.experience} yrs • {item.topics}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>
                      {new Date(item.date).toLocaleString()}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(index);
                      }}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 12,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "#E74C3C",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryMenu;
