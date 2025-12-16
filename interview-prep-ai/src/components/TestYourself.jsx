import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const TestYourself = ({ session, onClose, open, onSubmitScore }) => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD MCQs CORRECTLY
  useEffect(() => {
    if (!open || !session) return;

    const loadMCQs = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token");
          return;
        }

        const res = await axios.post(
          `${API_URL}/ai/mcqs`,
          {
            role: session.role,
            experience: session.experience,
            topics: session.topics || [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data?.ok && Array.isArray(res.data.mcqs)) {
          setQuiz(res.data.mcqs);
        } else {
          setQuiz([]);
        }
      } catch (err) {
        console.error("MCQ error:", err.response?.data || err.message);
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

  // SELECT OPTION
  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  // SUBMIT QUIZ
  const handleSubmit = () => {
    let s = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctIndex) s++;
    });
    setScore(s);
    setSubmitted(true);
  };

  const percent = useMemo(() => {
    if (!quiz.length) return 0;
    return Math.round((score / quiz.length) * 100);
  }, [score, quiz]);

  useEffect(() => {
    if (submitted) onSubmitScore(percent);
  }, [submitted, percent, onSubmitScore]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2400 }}>
      <div style={{ width: 800, maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 12, padding: 20 }}>
        <h2>{session.role} — Quiz</h2>

        {loading ? (
          <p>Generating MCQs...</p>
        ) : (
          <p>{quiz.length} Questions</p>
        )}

        {!loading &&
          quiz.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 16 }}>
              <b>{idx + 1}. {q.question}</b>
              {q.options.map((opt, oi) => (
                <div
                  key={oi}
                  onClick={() => handleSelect(idx, oi)}
                  style={{
                    padding: "8px 10px",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    marginTop: 4,
                    cursor: "pointer",
                    background:
                      submitted
                        ? oi === q.correctIndex
                          ? "#eaffea"
                          : answers[idx] === oi
                          ? "#ffecec"
                          : "#fff"
                        : answers[idx] === oi
                        ? "#eef6ff"
                        : "#fff",
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          ))}

        {!submitted && !loading && (
          <button onClick={handleSubmit}>Submit Quiz</button>
        )}

        {submitted && (
          <>
            <h3>Your Score: {percent}%</h3>
            <button onClick={onClose}>Close</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TestYourself;
