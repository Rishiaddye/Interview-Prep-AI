import { useState, useEffect, useMemo } from 'react';
import React from "react";
import axios from "axios";

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
    if (!open) return;

    const loadMCQs = async () => {
      try {
        setLoading(true);

        // Format Q&A for backend
        const formattedQuestions = session.questions.map((q) => ({
          q: q.question || q.q,
          a: q.answer || q.a,
        }));

        const res = await axios.post(
          "http://localhost:5000/api/ai/mcq",
          { questions: formattedQuestions }
        );

        if (res.data.ok && res.data.mcqs.length > 0) {
          setQuiz(res.data.mcqs);
        } else {
          setQuiz([]);
        }
      } catch (err) {
        console.error("MCQ fetch failed:", err);
      }

      setLoading(false);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
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
    if (quiz.length === 0) return 0;
    return Math.round((score / quiz.length) * 100);
  }, [score, quiz]);

  // SEND SCORE TO PARENT
  useEffect(() => {
    if (submitted) onSubmitScore(percent);
  }, [submitted, percent]);

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

      // ⭐⭐⭐ FIXED: Prevent modal auto-closing!
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: window.innerWidth < 768 ? "92%" : 800,
          maxHeight: window.innerWidth < 768 ? "70vh" : "90vh",
          overflowY: "auto",
          background: "white",
          borderRadius: 12,
          padding: window.innerWidth < 768 ? 10 : 20,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: window.innerWidth < 768 ? 8 : 12,
            color: "#1b1b1b",
            fontSize: window.innerWidth < 768 ? 14 : 22,
            fontWeight: 700,
          }}
        >
          {session?.role} — Quiz
        </h2>

        {loading ? (
          <p style={{ color: "#1b1b1b" }}>Generating MCQs...</p>
        ) : !submitted ? (
          <p style={{ opacity: 0.7, color: "#1b1b1b" }}>
            {quiz.length} Questions
          </p>
        ) : (
          <h3
            style={{
              color: "#1b1b1b",
              fontSize: window.innerWidth < 768 ? 14 : 18,
              fontWeight: 700,
            }}
          >
            Your Score: {percent}%
          </h3>
        )}

        {/* --------------------------- */}
        {/*        MCQ LIST             */}
        {/* --------------------------- */}
        {!loading &&
          quiz.map((item, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: window.innerWidth < 768 ? 8 : 20,
              }}
            >
              <b
                style={{
                  color: "#1b1b1b",
                  fontSize: window.innerWidth < 768 ? 12 : 15,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {idx + 1}. {item.q}
              </b>

              {item.options.map((opt, oi) => {
                const chosen = answers[idx] === oi;
                const isCorrect = item.correctIndex === oi;

                return (
                  <div
                    key={oi}
                    onClick={() => handleSelect(idx, oi)}
                    style={{
                      marginTop: 4,
                      padding:
                        window.innerWidth < 768 ? "6px 8px" : "10px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      border: "1px solid #ddd",
                      background: chosen ? "#eef6ff" : "#fff",
                      color: "#1b1b1b",
                      transition: "all 0.2s ease",
                      fontWeight: 500,
                      fontSize: window.innerWidth < 768 ? 12 : 14,

                      ...(submitted &&
                        (isCorrect
                          ? {
                              borderColor: "#2ecc71",
                              background: "#eaffea",
                            }
                          : chosen
                          ? {
                              borderColor: "#e74c3c",
                              background: "#ffe9e9",
                            }
                          : {})),
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          ))}

        {/* --------------------------- */}
        {/*      SUBMIT / CLOSE         */}
        {/* --------------------------- */}
        {!submitted && !loading ? (
          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg,#FF9324,#FCD760)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 12,
            }}
          >
            Submit Quiz
          </button>
        ) : !loading ? (
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              marginTop: 12,
              borderRadius: 10,
              background: "linear-gradient(90deg,#FF9324,#FCD760)",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
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
