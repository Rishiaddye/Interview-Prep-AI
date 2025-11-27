import React, { useState } from "react";
import TestYourself from "./TestYourself";
import SemiCircleGauge from "./SemiCircleGauge";

const SkeletonLoader = () => {
  const lines = [
    "70%", "95%", "90%", "80%", "92%",
    "88%", "96%", "60%", "85%", "93%",
    "78%", "98%",
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {lines.map((w, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg bg-[#ececec]"
          style={{ width: w, height: i % 5 === 0 ? 22 : 14 }}
        >
          <div
            className="absolute h-full w-[45%]"
            style={{
              background:
                "linear-gradient(90deg, rgba(230,230,230,0) 0%, rgba(240,240,240,0.9) 50%, rgba(230,230,230,0) 100%)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const SessionView = ({
  session,
  pinned,
  selectedQA,
  children,
  rightPanelRef,
  closeLearnPanel,
  learningLoading,
}) => {

  const [showTest, setShowTest] = useState(false);
  const [score, setScore] = useState(0);

  // -----------------------------------
  // 👉 Swipe-to-close states + logic
  // -----------------------------------
  const isMobile = window.innerWidth <= 768;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isMobile) return;
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    if (!touchStart || !touchEnd) return;

    const swipeDistance = touchEnd - touchStart;

    // 👉 Swipe right closes panel
    if (swipeDistance > 50) {
      closeLearnPanel();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] relative">

      {/* LEFT CONTENT */}
      <div className="flex flex-col gap-5">

        {/* Gauge Card */}
        <div className="w-full max-w-full sm:max-w-md lg:max-w-none mx-auto lg:mx-0 rounded-2xl bg-gradient-to-b from-[#fff9e6] to-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-6 py-5 flex flex-col items-center gap-3">
          <SemiCircleGauge percent={score} size={220} />
          <button
            onClick={() => setShowTest(true)}
            className="w-full sm:w-[80%] rounded-xl border-none bg-gradient-to-r from-[#FF9324] to-[#FCD760] px-4 py-2.5 text-sm font-semibold text-white cursor-pointer"
          >
            🧠 Test Yourself
          </button>
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
            <div className="mb-2 font-semibold">📌 Pinned Questions</div>
            <div className="flex flex-wrap gap-2">
             {pinned.map((i) => (
  <span
    key={i}
    className="rounded-lg border border-[#ffe2a1] bg-[#fff4d0] px-3 py-1 text-xs text-[#222]"
    style={{ color: "#222" }} 
  >
    {session.questions[i]?.q}
  </span>
))}

            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-3">{children}</div>

        {/* Test Modal */}
        {showTest && (
          <TestYourself
            session={session}
            open={showTest}
            onClose={() => setShowTest(false)}
            onSubmitScore={(s) => setScore(s)}
          />
        )}
      </div>

      {/* ----------------------------------- */}
      {/* RIGHT - LEARN PANEL  (swipe enabled) */}
      {/* ----------------------------------- */}
      <aside
        ref={rightPanelRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="
          rounded-2xl border border-[var(--border)] bg-[var(--card)]
          px-4 py-4 
          h-fit lg:max-h-[80vh] 
          overflow-y-auto 
          shadow-[0_6px_20px_rgba(0,0,0,0.06)]
          lg:sticky lg:top-4
          transition-all duration-300 ease-out
        "
        style={{
          transform:
            isMobile && touchStart && touchEnd
              ? `translateX(${Math.max(0, touchEnd - touchStart)}px)`
              : "translateX(0)",
        }}
      >
        {/* Drag Indicator (Mobile Only) */}
        {isMobile && selectedQA && (
          <div className="mx-auto mb-2 w-12 h-1.5 bg-gray-300 rounded-full" />
        )}

        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold">Learn & Reference</h3>
          {selectedQA && (
            <button
              onClick={closeLearnPanel}
              className="text-lg leading-none cursor-pointer"
              style={{ background: "transparent", border: "none" }}
            >
              ✕
            </button>
          )}
        </div>

        {!selectedQA && !learningLoading && (
          <p className="text-sm text-[var(--secondary-text)]">
            Click <b>“Learn More”</b> on any question.
          </p>
        )}

        {learningLoading && <SkeletonLoader />}

        {!learningLoading && selectedQA && (
          <div className="mt-2 space-y-3 text-sm leading-relaxed text-[var(--secondary-text)]">
            <h4 className="text-sm font-semibold text-[var(--text)]">
              {selectedQA.q}
            </h4>
            <div
              dangerouslySetInnerHTML={{ __html: selectedQA.longAnswer }}
              className="prose prose-sm max-w-none"
            />
          </div>
        )}
      </aside>
    </div>
  );
};

export default SessionView;
