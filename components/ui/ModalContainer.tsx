"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useId } from "react";
import { FaTimes } from "@/lib/icons";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  /** Show close button in header (default: true) */
  showCloseButton?: boolean;
  /** Custom header content (replaces default title/close button) */
  customHeader?: React.ReactNode;
  /** Additional description for screen readers */
  ariaDescription?: string;
}

/**
 * ModalContainer Component
 *
 * Reusable modal container with built-in accessibility features.
 * Extracted from ProjectModal.tsx and SkillsHeatMapModal.tsx (Priority 3.1).
 *
 * Features:
 * - Focus trap (Tab cycles within modal)
 * - Escape key to close
 * - Body scroll lock
 * - Click outside to close
 * - Smooth animations
 * - WCAG 2.1 AA compliant
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback when modal closes
 * @param title - Modal title (for accessibility)
 * @param children - Modal content
 * @param size - Modal width size (sm: 480px, md: 640px, lg: 896px, xl: 1280px, full: 100%)
 * @param className - Additional classes for modal content
 * @param showCloseButton - Show close button in header
 * @param customHeader - Custom header content
 * @param ariaDescription - Description for screen readers
 */
const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  className = "",
  showCloseButton = true,
  customHeader,
  ariaDescription,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  // Accessibility hooks
  const modalRef = useFocusTrap(isOpen);
  useEscapeKey(isOpen, onClose);
  useBodyScrollLock(isOpen);

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl lg:max-w-6xl",
    xl: "max-w-4xl lg:max-w-6xl xl:max-w-7xl",
    full: "max-w-full mx-4",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-2 pt-16 pb-4 sm:p-4 md:pt-20 md:pb-8"
          onClick={onClose}
          tabIndex={-1}
          aria-hidden="true"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={ariaDescription ? descriptionId : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className={`backdrop-blur-xl rounded-lg sm:rounded-2xl w-full ${sizeClasses[size]} max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-160px)] overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/95 to-gray-950/95 border border-secondary-default/30 shadow-secondary-default/20 flex flex-col ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            {customHeader || (
              <div className="relative px-3 py-2 sm:px-4 sm:py-3 border-b border-secondary-default/20 bg-gradient-to-r from-secondary-default/5 via-transparent to-secondary-default/5 flex-shrink-0">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Title */}
                  <h2
                    id={titleId}
                    className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#00BFFF] to-[#0080FF] bg-clip-text text-transparent truncate"
                  >
                    {title}
                  </h2>

                  {/* Close Button */}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-all duration-300 text-white/60 hover:text-red-400 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
                      aria-label="Close modal"
                    >
                      <FaTimes className="text-base sm:text-lg" />
                    </button>
                  )}
                </div>

                {/* Hidden description for screen readers */}
                {ariaDescription && (
                  <p id={descriptionId} className="sr-only">
                    {ariaDescription}
                  </p>
                )}
              </div>
            )}

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalContainer;
