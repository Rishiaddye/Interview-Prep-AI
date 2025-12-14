import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ children, isOpen, onClose, variant = "default" }) => {

  // Styles for each modal type
  const modalStyle = {
    default: {
      className:
        "relative bg-white shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-2xl p-6 w-[90vw] md:w-[33vw]",
      style: {},
    },
    glass: {
      className:
        "relative p-0 w-auto max-w-[95vw] md:max-w-[680px]",
      style: {
        background: "transparent",
        border: "none",
        boxShadow: "none",
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal wrapper */}
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center px-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >

          <div
  className={`${modalStyle[variant].className} ${
    variant === "glass"
      ? "bg-transparent shadow-none border-none"
      : "bg-white"
  }`}
  style={modalStyle[variant].style}
  onClick={(e) => e.stopPropagation()}
>


              {/* Close button */}
              <button
                className={`absolute top-4 right-4 p-2 rounded-full transition cursor-pointer ${
                  variant === "glass"
                    ? "bg-white/60 backdrop-blur-md hover:bg-white text-black"
                    : "bg-[#F3E7D9] hover:bg-[#e6d4c2] text-black"
                }`}
                onClick={onClose}
              >
                ✕
              </button>

              <div>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
