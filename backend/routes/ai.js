// routes/ai.js
const express = require("express");
const router = express.Router();

const {
  generateInterview,
  generateLongExplanation,
  generateMCQs
} = require("../services/aiService");

/* ===========================================================
   1. Generate Interview Questions
=========================================================== */
router.post("/generate", async (req, res) => {
  const { role, experience, topics } = req.body;

  try {
    const questions = await generateInterview(role, experience, topics || []);

    res.json({
      ok: true,
      questions: questions.map(item => ({
        q: item.q,          // FIXED
        a: item.a,          // FIXED
        followup: item.followup,
        why: item.why
      }))
    });
  } catch (err) {
    console.error("AI /generate error:", err);
    res.status(500).json({
      ok: false,
      message: "AI generation failed"
    });
  }
});

/* ===========================================================
   2. Learn Mode (Long Explanation)
=========================================================== */
router.post("/learn", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        ok: false,
        message: "Missing question or answer"
      });
    }

    const longAnswer = await generateLongExplanation(question, answer);
    res.json({ ok: true, longAnswer });
  } catch (err) {
    console.error("AI /learn error:", err);
    res.status(500).json({
      ok: false,
      message: "AI learn failed"
    });
  }
});

/* ===========================================================
   3. Generate MCQs
=========================================================== */
router.post("/mcq", async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "No valid questions provided"
      });
    }

    const mcqs = await generateMCQs(questions);
    res.json({ ok: true, mcqs });
  } catch (err) {
    console.error("AI /mcq error:", err);
    res.status(500).json({
      ok: false,
      message: "MCQ generation failed"
    });
  }
});

module.exports = router;
