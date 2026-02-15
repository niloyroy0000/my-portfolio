import { useEffect } from "react";

/**
 * useEscapeKey Hook
 *
 * Listens for the Escape key press and triggers a callback.
 * Commonly used to close modals/dialogs for accessibility (WCAG 2.1 AA).
 *
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Callback function to execute when Escape is pressed
 *
 * @example
 * ```tsx
 * useEscapeKey(isOpen, () => setIsOpen(false));
 * ```
 */
export const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Add listener to document to catch Escape from anywhere
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
};
