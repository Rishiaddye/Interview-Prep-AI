
import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ add animation

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ✅ Background Overlay with Fade */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // close when clicking outside modal
          />

          {/* ✅ Center Modal Card with Smooth Scale Animation */}
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="relative bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 w-[90vw] md:w-[33vw]"
              onClick={(e) => e.stopPropagation()} // stops click from closing modal
            >
              {!hideHeader && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              )}

              {/* ✅ Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md bg-[#F3E7D9] text-black hover:bg-[#e6d4c2] transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="overflow-visible">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
