"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TypingAnimation - Typewriter effect for rotating text phrases
 *
 * Features:
 * - Smooth typing and deleting animation
 * - Cycles through multiple phrases
 * - Blinking cursor
 * - Configurable speeds and delays
 * - Accessible with aria-live
 */

interface TypingAnimationProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  phrases,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = "",
  cursorClassName = "",
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPhrase = phrases[currentPhraseIndex];

  const handleTyping = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      // Typing
      if (currentText.length < currentPhrase.length) {
        setCurrentText(currentPhrase.slice(0, currentText.length + 1));
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        setCurrentText(currentText.slice(0, -1));
      } else {
        // Finished deleting, move to next phrase
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }
  }, [currentText, currentPhrase, isDeleting, isPaused, pauseDuration, phrases.length]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [handleTyping, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className="inline-flex items-center" aria-live="polite">
      <span className={`inline ${className}`}>
        {currentText}
      </span>
      <motion.span
        className={`inline-block w-[3px] h-[1.1em] ml-1 ${cursorClassName}`}
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        aria-hidden="true"
      />
    </span>
  );
};

export default TypingAnimation;
