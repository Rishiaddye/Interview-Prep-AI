import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const TestYourself = ({ session, onClose, open, onSubmitScore }) => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // LOAD MCQs WHEN MODAL OPENS
  // ----------------------------------------
  useEffect(() => {
    if (!open || !session) return;

    const loadMCQs = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ No auth token");
          return;
        }

        const res = await axios.post(
          `${API_URL}/ai/mcqs`, // ✅ CORRECT ENDPOINT
          {
            role: session.role,
            experience: session.experience,
            topics: session.topics || [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data?.ok && Array.isArray(res.data.mcqs)) {
          // Normalize MCQs for UI
          const normalized = res.data.mcqs.map((q) => ({
            q: q.question,
            options: q.options,
            correctIndex: q.options.indexOf(q.correctAnswer),
          }));

          setQuiz(normalized);
        } else {
          setQuiz([]);
        }
      } catch (err) {
        console.error("❌ MCQ fetch failed:", err);
        setQuiz([]);
      } finally {
        setLoading(false);
        setAnswers({});
        setSubmitted(false);
        setScore(0);
      }
    };

    loadMCQs();
  }, [open, session]);

  // ----------------------------------------
  // SELECT OPTION
  // ----------------------------------------
  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  // ----------------------------------------
  // SUBMIT QUIZ
  // ----------------------------------------
  const handleSubmit = () => {
    let s = 0;
    for (let i = 0; i < quiz.length; i++) {
      if (answers[i] === quiz[i].correctIndex) s++;
    }
    setScore(s);
    setSubmitted(true);
  };

  // ----------------------------------------
  // CALCULATE PERCENTAGE
  // ----------------------------------------
  const percent = useMemo(() => {
    if (!quiz.length) return 0;
    return Math.round((score / quiz.length) * 100);
  }, [score, quiz]);

  useEffect(() => {
    if (submitted) onSubmitScore(percent);
  }, [submitted, percent, onSubmitScore]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2400,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>
          {session.role} — Quiz
        </h2>

        {loading ? (
          <p>Generating MCQs...</p>
        ) : !submitted ? (
          <p>{quiz.length} Questions</p>
        ) : (
          <h3>Your Score: {percent}%</h3>
        )}

        {!loading &&
          quiz.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 20 }}>
              <b>{idx + 1}. {item.q}</b>

              {item.options.map((opt, oi) => {
                const chosen = answers[idx] === oi;
                const isCorrect = item.correctIndex === oi;

                return (
                  <div
                    key={oi}
                    onClick={() => handleSelect(idx, oi)}
                    style={{
                      marginTop: 6,
                      padding: "10px 12px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      background: chosen ? "#eef6ff" : "#fff",
                      ...(submitted &&
                        (isCorrect
                          ? { background: "#eaffea", borderColor: "#2ecc71" }
                          : chosen
                          ? { background: "#ffe9e9", borderColor: "#e74c3c" }
                          : {})),
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          ))}

        {!submitted && !loading ? (
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "linear-gradient(90deg,#FF9324,#FCD760)",
              border: "none",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Submit Quiz
          </button>
        ) : !loading ? (
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              background: "linear-gradient(90deg,#FF9324,#FCD760)",
              border: "none",
              color: "#fff",
            }}
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TestYourself;
