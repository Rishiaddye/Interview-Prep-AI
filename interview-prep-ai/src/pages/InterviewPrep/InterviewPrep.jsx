import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import QAItem from "../../components/QAItem";
import SessionView from "../../components/SessionView";
import { getSession } from "../../apis/sessionApi";
import { useTheme } from "../../context/themeContext";

const API_URL = import.meta.env.VITE_API_URL;

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

  // =========================
  // LOAD SESSION
  // =========================
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
    }, 800);
  };

  // =========================
  // ✅ FIXED LEARN MORE
  // =========================
  const handleLearnMore = async (qObj, idx) => {
    try {
      setActiveIndex(idx);
      setLearningLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/ai/learn-more`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: qObj.q,
        }),
      });

      const data = await res.json();

      setSelectedQA({
        q: qObj.q,
        a: qObj.a,
        longAnswer:
          data?.ok && data.explanation
            ? data.explanation
            : "<p>Could not generate explanation.</p>",
      });

      if (isMobile && rightPanelRef.current) {
        setTimeout(() => {
          rightPanelRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      }
    } catch (err) {
      setSelectedQA({
        q: qObj.q,
        longAnswer: `<p>Error loading explanation</p>`,
      });
    } finally {
      setLearningLoading(false);
    }
  };

  const closeLearnPanel = () => {
    setSelectedQA(null);
    setActiveIndex(null);
  };

  // =========================
  // STYLES
  // =========================
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
        }
      : {
          background: "#fff",
          color: "#000",
          padding: "14px 28px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.25)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "15px",
        };

  const badgeStyle =
    theme === "light"
      ? {
          background: "#000",
          color: "#fff",
          padding: "8px 16px",
          borderRadius: "18px",
          fontSize: "14px",
        }
      : {
          background: "rgba(255,255,255,0.9)",
          color: "#000",
          padding: "8px 16px",
          borderRadius: "18px",
          fontSize: "14px",
        };

  return (
    <>
      <Navbar />

      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1400, margin: "30px auto", padding: "0 28px" }}>
          {loading && <p>Loading session...</p>}

          {!loading && session && (
            <>
              <h2>{session.role}</h2>
              <p>{session.topics?.join(", ")}</p>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <span style={badgeStyle}>Experience: {session.experience}</span>
                <span style={badgeStyle}>
                  {session.questions.length} Q&A
                </span>
              </div>

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
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                    <button
                      onClick={handleLoadMore}
                      disabled={loadMoreLoading}
                      style={buttonStyle}
                    >
                      {loadMoreLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )}
              </SessionView>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InterviewPrep;
