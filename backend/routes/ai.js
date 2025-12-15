// backend/routes/ai.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateInterview,
  generateLearnMore,
  generateMCQs,
} = require("../services/aiService");

/* ===========================================================
   1️⃣ Generate Interview Questions (JWT Protected)
   POST /api/ai/generate
=========================================================== */
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const { role, experience, topics } = req.body;

    if (!role || !experience) {
      return res.status(400).json({
        ok: false,
        error: "Role and experience are required",
      });
    }

    const questionList = await generateInterview(
      role,
      experience,
      topics || []
    );

    res.json({
      ok: true,
      questions: questionList.map((q) => ({
        q: q.q,
        a: q.a,
        followup: q.followup || "",
        why: q.why || "",
      })),
    });
  } catch (err) {
    console.error("AI /generate ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Failed to generate interview questions",
    });
  }
});

/* ===========================================================
   2️⃣ Learn More (Long Explanation) — JWT Protected
   POST /api/ai/learn-more
=========================================================== */
router.post("/learn-more", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        ok: false,
        error: "Question is required",
      });
    }

    const explanation = await generateLearnMore(question);

    res.json({
      ok: true,
      explanation, // 👈 frontend expects this
    });
  } catch (err) {
    console.error("AI /learn-more ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Failed to generate explanation",
    });
  }
});

/* ===========================================================
   3️⃣ Generate MCQs (Test Yourself) — JWT Protected
   POST /api/ai/mcqs
=========================================================== */
router.post("/mcqs", authMiddleware, async (req, res) => {
  try {
    const { role, experience, topics } = req.body;

    if (!role || !experience) {
      return res.status(400).json({
        ok: false,
        error: "Role and experience are required",
      });
    }

    const mcqs = await generateMCQs(role, experience, topics || []);

    res.json({
      ok: true,
      mcqs, // 👈 MUST be array of 10 MCQs
    });
  } catch (err) {
    console.error("AI /mcqs ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Failed to generate MCQs",
    });
  }
});

module.exports = router;
