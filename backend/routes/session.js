// routes/session.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const { generateInterview } = require("../services/aiService");

/* ===========================================================
   CREATE SESSION (AI Interview)
   =========================================================== */
router.post("/create", async (req, res) => {
  try {
    const { userId, role, experience, topics } = req.body;

    const topicList = Array.isArray(topics)
      ? topics
      : typeof topics === "string"
      ? topics.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const session = new Session({
      userId: userId || null,
      role,
      experience,
      topics: topicList
    });

    await session.save();

    const questions = await generateInterview(role, experience, topicList);

    session.questions = questions.map(q => ({
      q: q.question || q.q,
      a: q.answer || q.a,
      followup: q.followup || "",
      why: q.why || ""
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
   GET SESSION BY ID
   =========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, session });
  } catch (err) {
    console.error("SESSION GET ERROR:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

module.exports = router;
