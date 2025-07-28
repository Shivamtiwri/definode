"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants, Easing } from "framer-motion";
import { CheckCircle, X, Sparkles, ArrowRight } from "lucide-react";
import { map } from "lodash";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";
import Link from "next/link";
// import "bootstrap/dist/css/bootstrap.min.css";

interface IProps {
  hash: string;
  categoryId: number;
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
}
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}
const validator = ["", "PREMIUM", "STANDARD", "OBSERVER", "RATING", "MICRO"];

const PurchaseSuccessModal = (props: IProps) => {
  const { hash, setIsOpen, categoryId, isOpen } = props;
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // Generate confetti particles
  useEffect(() => {
    if (isOpen) {
      const particles: ConfettiParticle[] = Array.from(
        { length: 50 },
        (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          scale: Math.random() * 0.5 + 0.5,
          color: ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][
            Math.floor(Math.random() * 5)
          ],
        })
      );
      setConfetti(particles);
    }
  }, [isOpen]);

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.3,
      },
    },
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        delay: 0.2,
        duration: 0.6,
        bounce: 0.4,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  {
    confetti.map((particle, i) => (
      <motion.div
        key={particle.id}
        className="position-absolute rounded-circle"
        style={{
          width: "12px",
          height: "12px",
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          backgroundColor: particle.color,
        }}
        // variants={confettiVariants}
        initial="hidden"
        animate="visible"
        custom={i}
      />
    ));
  }

  const categoryStyles: Record<
    number,
    { bg: string; text: string; border: string }
  > = {
    1: { bg: "#bfff00", text: "#000", border: "#036672" }, // STANDARD - Cyan
    2: { bg: "#bfff00", text: "#000", border: "#036672" }, // STANDARD - Cyan
    3: { bg: "#bfff00", text: "#000", border: "#036672" }, // STANDARD - Cyan
    4: { bg: "#bfff00", text: "#000", border: "#036672" }, // STANDARD - Cyan
    5: { bg: "#bfff00", text: "#000", border: "#036672" }, // STANDARD - Cyan
  };

  const style = categoryStyles[categoryId] || {
    bg: "#bfff00", // default gray
    text: "#000",
    border: "#4b5563",
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="modal-backdrop show"
            style={{
              zIndex: 1050,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
            }}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
          />

          {/* Confetti */}
          <div
            className="position-fixed top-0 start-0 w-100 h-100 pointer-events-none"
            style={{ zIndex: 1050 }}
          >
            {confetti.map((particle, i) => (
              <motion.div
                key={particle.id}
                className="position-absolute rounded-circle"
                style={{
                  width: "12px",
                  height: "12px",
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                }}
                // variants={confettiVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              />
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            className="modal d-flex align-items-center justify-content-center p-3"
            style={{ zIndex: 1060 }}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div
                className="modal-content border-0 shadow-lg"
                style={{
                  background: "linear-gradient(to bottom, #350145, #080000)",
                }}
              >
                {/* Close Button */}
                <div className="modal-header  border-0">
                  <motion.div
                    // type="button"
                    className="btn-close float-end btn-close-white"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close"
                    style={{ cursor: "pointer" }}
                  >
                    <IoMdCloseCircle size={30} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="modal-body text-center p-5">
                  {/* Success Icon */}
                  <motion.div
                    className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle bg-success-subtle"
                    style={{ width: "100px", height: "100px" }}
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <CheckCircle
                      className="text-success"
                      style={{ width: "50px", height: "50px" }}
                    />
                  </motion.div>

                  {/* Main Heading */}
                  <motion.h2
                    className="modal-title fs-2 fw-bold text-white mb-3"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    Thank You!
                  </motion.h2>

                  {/* Subheading */}
                  <motion.p
                    className="text-light mb-4 fs-5"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                  >
                    Your purchased was successful
                  </motion.p>

                  {/* Purchase Details */}
                  <motion.div
                    className="rounded-3 p-4 mb-4"
                    style={{ backgroundColor: "#240130" }}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                  >
                    <div className="mb-3 mx-4">
                      <div className="text-light h-1 font-weight-bold fs-5 fw-medium mb-2">
                        Node you have purchased
                      </div>

                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, type: "spring" }}
                        className="fw-bold  font-italic text-center rounded-4  shadow-lg px-4 py-1 rounded w-fit m-auto "
                        style={{
                          backgroundColor: style.bg,
                          color: style.text,
                          borderColor: style.border,
                          fontSize: "1rem",
                          letterSpacing: "1px",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        {validator[categoryId]}
                      </motion.div>
                    </div>

                    <div className="d-flex justify-content-between mt-4 px-2">
                      <span className="text-light">Transaction Hash:</span>
                      <span className="font-monospace pt-1  text-primary small">
                        <Link
                          target="_blank"
                          href={`https://bscscan.com/tx/${hash}`}
                        >
                          {hash?.slice(0, 4)}...{hash?.slice(-6)}
                        </Link>
                      </span>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column gap-3">
                    <motion.button
                      onClick={() => toast.success("Coming soon...!")}
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background:
                          "linear-gradient(to right, #8b5cf6, #3b82f6)",
                      }}
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Sparkles className="me-1" size={20} />
                      View Your Dashboard
                      <ArrowRight className="ms-1" size={20} />
                    </motion.button>

                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className="btn btn-outline-light w-100"
                      style={{
                        background:
                          "linear-gradient(to bottom, #350145, #080000)",
                        borderColor: "#000",
                      }}
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PurchaseSuccessModal;
