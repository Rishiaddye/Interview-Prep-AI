// src/components/QAItem.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6A3EC5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3l4 4-6 6v4l-4 4v-6l-6-6 4-4 6 6 2-2-6-6 2-2z" />
  </svg>
);

const UnpinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6A3EC5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M17 3l4 4-6 6v4l-4 4v-6l-6-6 4-4 6 6 2-2-6-6 2-2z" />
  </svg>
);

const QAItem = ({ index, question, answer, followup, why, pinned, onPin, onLearnMore, isActive = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01, boxShadow: "0 10px 26px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.22 }}
      style={{
        background: isActive ? "linear-gradient(180deg,#fffaf6,#fffefc)" : "var(--card)",
        borderRadius: 14,
        padding: "18px 22px",
        marginBottom: 18,
        border: isActive ? "1px solid rgba(255,160,40,0.12)" : "1px solid #eee",
        boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#222", marginTop: 2 }}>Q</div>

        <div
          style={{ flex: 1, fontWeight: 500, fontSize: 15, lineHeight: 1.45, cursor: "pointer" }}
          onClick={() => setOpen((p) => !p)}
        >
          {question}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: -4 }}>
          <button onClick={onPin} style={{ width: 40, height: 40, borderRadius: 12, border: "none", background: pinned ? "rgba(235,226,255,0.9)" : "rgba(244,240,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {pinned ? <UnpinIcon /> : <PinIcon />}
          </button>

          <button onClick={onLearnMore} style={{ padding: "10px 18px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: "rgba(230,255,255,0.95)", color: "#005A78", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0096B8"><path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" /></svg>
            Learn More
          </button>

          <button onClick={() => setOpen((p) => !p)} style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
           <div
  className="pinned-question-text"
  style={{ marginTop: 16, color: "#444", lineHeight: "1.6" }}
>
              <div dangerouslySetInnerHTML={{ __html: answer }} />

              {followup && <div style={{ marginTop: 10 }}><strong>Followup:</strong><p>{followup}</p></div>}
              {why && <div style={{ marginTop: 10 }}><strong>Why this matters:</strong><p>{why}</p></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QAItem;
