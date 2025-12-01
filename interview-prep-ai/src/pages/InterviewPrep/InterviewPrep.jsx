import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import QAItem from "../../components/QAItem";
import SessionView from "../../components/SessionView";
import { getSession } from "../../apis/sessionApi";
import { useTheme } from "../../context/themeContext";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const { theme } = useTheme();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQA, setSelectedQA] = useState(null);
  const [pinned, setPinned] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);

  const rightPanelRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const resp = await getSession(sessionId);
      if (resp?.ok) setSession(resp.session);
      setLoading(false);
    };
    if (sessionId) load();
  }, [sessionId]);

  const onPin = (idx) => {
    setPinned((prev) =>
      prev.includes(idx) ? prev.filter((p) => p !== idx) : [idx, ...prev]
    );
  };

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setLoadMoreLoading(false);
    }, 1200);
  };

  const handleLearnMore = async (qObj, idx) => {
    try {
      setActiveIndex(idx);
      setLearningLoading(true);

      const res = await fetch("/api/ai/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: qObj.q,
          answer: qObj.a || qObj.answer || qObj.a,
        }),
      });

      const data = await res.json();

      setSelectedQA({
        q: qObj.q,
        a: qObj.a || qObj.answer || qObj.a,
        longAnswer:
          data?.ok && data.longAnswer
            ? data.longAnswer
            : "<p>Could not generate explanation.</p>",
      });

      if (isMobile) {
        setTimeout(() => {
          if (rightPanelRef.current) {
            rightPanelRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 200);
      }
    } catch (err) {
      setSelectedQA({
        q: qObj.q,
        longAnswer: `<p>Error: ${err.message}</p>`,
      });
    } finally {
      setLearningLoading(false);
    }
  };

  const closeLearnPanel = () => {
    setSelectedQA(null);
    setActiveIndex(null);
  };

  // 👇 FINAL FIX: Black clean button in light mode, White glowing in dark mode
  const buttonStyle =
    theme === "light"
      ? {
          background: "#000",
          color: "#fff",
          padding: "14px 28px",
          borderRadius: "14px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "15px",
          transition: "0.25s",
          boxShadow: "none", // ❌ glow removed
        }
      : {
          background: "#fff",
          color: "#000",
          padding: "14px 28px",
          borderRadius: "14px",
          border: "1.4px solid rgba(255,255,255,0.25)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "15px",
          transition: "0.25s",
          boxShadow: "0px 0px 22px rgba(255,255,255,0.25)", // glow stays
        };

  return (
    <>
      <Navbar />

      <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)" }}>
        <div
          style={{
            position: "absolute",
            top: -150,
            left: "50%",
            width: 900,
            height: 500,
            transform: "translateX(-50%)",
            background:
              "radial-gradient(circle, rgba(255, 217, 176, 0.5), rgba(255, 255, 255, 0.3), transparent)",
            filter: "blur(120px)",
            opacity: 0.35,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1400, margin: "30px auto", padding: "0 28px" }}>
          {loading && (
            <div style={{ padding: 40, color: "var(--text)" }}>
              Loading session...
            </div>
          )}

          {!loading && session && (
            <>
              <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>
                {session.role}
              </h2>

              <p style={{ fontSize: 16, color: "var(--secondary-text)", marginBottom: 16 }}>
                {session.topics?.join(", ")}
              </p>

              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "var(--text)" }}>
                Interview Q & A
              </h3>

              <SessionView
                session={session}
                pinned={pinned}
                selectedQA={selectedQA}
                onPin={onPin}
                rightPanelRef={rightPanelRef}
                closeLearnPanel={closeLearnPanel}
                learningLoading={learningLoading}
              >
                {session.questions.slice(0, visibleCount).map((q, idx) => (
                  <QAItem
                    key={idx}
                    index={idx}
                    question={q.q}
                    answer={q.a}
                    followup={q.followup}
                    why={q.why}
                    pinned={pinned.includes(idx)}
                    onPin={() => onPin(idx)}
                    onLearnMore={() => handleLearnMore(q, idx)}
                    isActive={activeIndex === idx}
                  />
                ))}

                {visibleCount < session.questions.length && (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 25 }}>
                    <button onClick={handleLoadMore} disabled={loadMoreLoading} style={buttonStyle}>
                      {loadMoreLoading ? (
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `2px solid ${theme === "light" ? "#fff" : "#000"}`,
                            borderTop: "2px solid transparent",
                            animation: "spin .6s linear infinite",
                          }}
                        />
                      ) : (
                        <>
                          <div
                            style={{
                              width: 20,
                              height: 14,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={{ height: 2, width: "100%", background: "currentColor" }} />
                            <span style={{ height: 2, width: "65%", background: "currentColor" }} />
                            <span style={{ height: 2, width: "40%", background: "currentColor" }} />
                          </div>
                          Load More
                        </>
                      )}
                    </button>
                  </div>
                )}
              </SessionView>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

const badgeStyle = {
  padding: "6px 14px",
  borderRadius: 20,
  fontSize: 13,
  background: "var(--card)",
  color: "var(--text)",
  fontWeight: 500,
  border: "1px solid var(--border)",
  transition: "all 0.35s ease",
};

export default InterviewPrep;
