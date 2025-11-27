import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import QAItem from "../../components/QAItem";
import SessionView from "../../components/SessionView";
import { getSession } from "../../apis/sessionApi";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQA, setSelectedQA] = useState(null);
  const [pinned, setPinned] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const rightPanelRef = useRef(null);

  // Detect if user is on Mobile
  const isMobile = window.innerWidth <= 768;

  // Fetch session
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

  // Learn More Logic
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

      // ⭐ ONLY scroll on mobile
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

  return (
    <>
      <Navbar />

      <div style={{ position: "relative", minHeight: "100vh", background: "var(--bg)" }}>
        {/* Background Glow */}
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
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1400,
            margin: "30px auto",
            padding: "0 28px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {loading && (
            <div style={{ padding: 40, color: "var(--text)" }}>
              Loading session...
            </div>
          )}

          {!loading && session && (
            <>
              <h2
                style={{
                  fontSize: 40,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "var(--text)",
                }}
              >
                {session.role}
              </h2>

              <p
                style={{
                  fontSize: 16,
                  color: "var(--secondary-text)",
                  marginBottom: 16,
                }}
              >
                {session.topics?.join(", ")}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 40,
                  flexWrap: "wrap",
                }}
              >
                <span style={badgeStyle}>
                  Experience: {session.experience} Years
                </span>
                <span style={badgeStyle}>
                  {session.questions.length} Q&A
                </span>
                <span style={badgeStyle}>
                  Last Updated:{" "}
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 20,
                  color: "var(--text)",
                }}
              >
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
                {session.questions.map((q, idx) => (
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
              </SessionView>
            </>
          )}
        </div>
      </div>
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