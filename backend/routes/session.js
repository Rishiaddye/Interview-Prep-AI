// routes/session.js
const express = require("express");
const router = express.Router();

const Session = require("../models/Session");
const { generateInterview } = require("../services/aiService");
const authMiddleware = require("../middleware/authMiddleware");

/* ===========================================================
   CREATE SESSION (AI Interview) — JWT PROTECTED
=========================================================== */
router.post("/create", authMiddleware, async (req, res) => {
  try {
    // 🔐 USER ID FROM JWT (NOT FROM BODY)
    const userId = req.user.id;

    const { role, experience, topics } = req.body;

    const topicList = Array.isArray(topics)
      ? topics
      : typeof topics === "string"
      ? topics.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const session = new Session({
      userId,
      role,
      experience,
      topics: topicList,
    });

    await session.save();

    const questions = await generateInterview(role, experience, topicList);

    session.questions = questions.map(q => ({
      q: q.q,
      a: q.a,
      followup: q.followup || "",
      why: q.why || "",
    }));

    session.aiGenerated = true;
    await session.save();

    res.json({ ok: true, session });
  } catch (err) {
    console.error("SESSION CREATE ERROR:", err);
    res.status(500).json({ ok: false, error: "Session creation failed" });
  }
});

/* ===========================================================
   GET SESSION BY ID — JWT PROTECTED
=========================================================== */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session)
      return res.status(404).json({ ok: false, error: "Not found" });

    // 🔐 Optional: ensure session belongs to logged-in user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ ok: false, error: "Unauthorized" });
    }

    res.json({ ok: true, session });
  } catch (err) {
    console.error("SESSION GET ERROR:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
