/**
 * Centralized Z-Index Layer Management
 *
 * Standardizes z-index values across the application to prevent conflicts
 * and ensure predictable stacking order.
 *
 * Layer Hierarchy (lowest to highest):
 * - Base: 0-9 (default content, no explicit z-index needed)
 * - Sticky Elements: 10-49 (sticky headers, fixed navigation)
 * - Dropdowns/Overlays: 50-99 (dropdowns, popovers)
 * - Header/Navigation: 100-119 (site header, navigation bar)
 * - Toolbars/Filters: 110-119 (filter bars, search toolbars)
 * - Modal Backdrop: 140-149 (modal overlay backgrounds)
 * - Modals/Dialogs: 150-159 (modal content, dialog boxes)
 * - Notifications/Toasts: 160-169 (toast notifications, alerts)
 * - Tooltips/Popovers: 999 (tooltips must appear above everything including filter panels)
 * - Emergency: 1000+ (critical overlays, loading screens)
 *
 * Usage:
 * ```tsx
 * import { Z_INDEX } from '@/constants/zIndex';
 *
 * <div className={`z-[${Z_INDEX.TOOLTIP}]`}>Tooltip</div>
 * // or use Tailwind's arbitrary values:
 * <div className="z-[150]">Modal</div>
 * ```
 */

export const Z_INDEX = {
  /**
   * Base layer - Default content (no explicit z-index needed)
   */
  BASE: 0,

  /**
   * Sticky elements layer (sticky headers, fixed sidebars)
   */
  STICKY: 10,

  /**
   * Dropdown and overlay layer (select dropdowns, popover content)
   */
  DROPDOWN: 50,

  /**
   * Site header and navigation layer
   */
  HEADER: 100,

  /**
   * Toolbar and filter bars layer (project filters, search bars)
   */
  TOOLBAR: 110,

  /**
   * Modal backdrop layer (dark overlay behind modals)
   */
  MODAL_BACKDROP: 140,

  /**
   * Modal and dialog content layer
   */
  MODAL: 150,

  /**
   * Notification and toast layer (success/error messages)
   */
  NOTIFICATION: 160,

  /**
   * Tooltip and context menu layer (must be above modals and filter panels)
   */
  TOOLTIP: 999,

  /**
   * Emergency layer (loading screens, critical alerts)
   */
  EMERGENCY: 1000,
} as const;

/**
 * Type helper for z-index values
 */
export type ZIndexLayer = typeof Z_INDEX[keyof typeof Z_INDEX];

/**
 * Utility function to get z-index Tailwind class
 *
 * @param layer - Z-index layer constant
 * @returns Tailwind z-index class string
 *
 * @example
 * ```tsx
 * import { getZIndexClass, Z_INDEX } from '@/constants/zIndex';
 *
 * <div className={getZIndexClass(Z_INDEX.TOOLTIP)}>Tooltip</div>
 * // Returns: "z-[999]"
 * ```
 */
export function getZIndexClass(layer: ZIndexLayer): string {
  return `z-[${layer}]`;
}

/**
 * Commonly used z-index classes for convenience
 */
export const Z_INDEX_CLASSES = {
  STICKY: 'z-10',
  DROPDOWN: 'z-50',
  HEADER: 'z-[100]',
  TOOLBAR: 'z-[110]',
  MODAL_BACKDROP: 'z-[140]',
  MODAL: 'z-[150]',
  NOTIFICATION: 'z-[160]',
  TOOLTIP: 'z-[999]',
  EMERGENCY: 'z-[1000]',
} as const;
