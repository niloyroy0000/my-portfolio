import { useEffect, useRef } from "react";

/**
 * useFocusTrap Hook
 *
 * Traps keyboard focus within a modal/dialog for accessibility (WCAG 2.1 AA).
 * When the modal is open, Tab cycles through focusable elements within the modal only.
 *
 * @param isOpen - Whether the modal is currently open
 * @returns ref - Attach this ref to the modal container element
 *
 * @example
 * ```tsx
 * const modalRef = useFocusTrap(isOpen);
 * return <div ref={modalRef} role="dialog">...</div>
 * ```
 */
export const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements within the modal
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(container.querySelectorAll(focusableSelectors));
    };

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when modal opens
    if (firstElement) {
      // Small delay to ensure modal animation has started
      setTimeout(() => firstElement.focus(), 100);
    }

    // Handle Tab key to trap focus
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // Refresh focusable elements (in case content changed)
      const currentFocusable = getFocusableElements();
      if (currentFocusable.length === 0) return;

      const firstEl = currentFocusable[0];
      const lastEl = currentFocusable[currentFocusable.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  return containerRef;
};
