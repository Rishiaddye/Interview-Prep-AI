const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const { generateInterview } = require("../services/aiService.js");

// =============================
// CREATE SESSION
// =============================
router.post("/create", async (req, res) => {
  try {
    const { userId, role, experience, topics } = req.body;

    // 1. Create empty session first
    const session = new Session({
      userId: userId || null,
      role,
      experience,
      topics: topics ? topics.split(",").map(t => t.trim()) : []
    });

    await session.save();

    // 2. Generate Q/A from AI
    const questions = await generateInterview(role, experience, session.topics);

    // 3. Map AI output → backend schema (q,a,followup,why)
    session.questions = questions.map(q => ({
      q: q.question || q.q,
      a: q.answer || q.a,
      followup: q.followup || "",
      why: q.why || ""
    }));

    session.aiGenerated = true;
    await session.save();

    // 4. Return in a consistent structure for frontend
    res.json({
      ok: true,
      session
    });
  } catch (err) {
    console.error("SESSION CREATE ERROR:", err);
    res.status(500).json({ ok: false, error: "Session create failed" });
  }
});

// =============================
// GET SESSION BY ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session)
      return res.status(404).json({ ok: false, error: "Not found" });

    // 🔥 MUST return in correct format
    res.json({ ok: true, session });
  } catch (err) {
    console.error("SESSION GET ERROR:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});


module.exports = router;