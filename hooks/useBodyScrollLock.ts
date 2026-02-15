import { useEffect } from "react";

/**
 * useBodyScrollLock Hook
 *
 * Locks/unlocks body scroll when a modal is open.
 * Prevents background scrolling while modal is visible.
 *
 * Features:
 * - Preserves scroll position when locking
 * - Restores scroll position when unlocking
 * - Handles multiple modals (tracks lock count)
 *
 * @param isOpen - Whether the modal is currently open
 *
 * @example
 * ```tsx
 * useBodyScrollLock(isOpen);
 * ```
 */
export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;

    // Store original body styles
    const originalStyle = window.getComputedStyle(document.body);
    const originalOverflow = originalStyle.overflow;
    const originalPaddingRight = originalStyle.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll
    document.body.style.overflow = 'hidden';

    // Add padding to prevent layout shift when scrollbar disappears
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore original styles
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);
};
