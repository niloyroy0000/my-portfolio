/**
 * Array Utilities
 *
 * Common array manipulation helpers used across the portfolio.
 * Created as Priority 4.3 for code organization and reusability.
 */

/**
 * Get unique values from an array
 *
 * @param array - Input array
 * @returns Array with duplicates removed
 *
 * @example
 * ```ts
 * const unique = getUniqueValues([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
 * ```
 */
export const getUniqueValues = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * Get unique values from an array of objects by a specific key
 *
 * @param array - Input array of objects
 * @param key - Key to check for uniqueness
 * @returns Array with duplicates removed based on key
 *
 * @example
 * ```ts
 * const users = [{ id: 1, name: "Alice" }, { id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
 * const unique = getUniqueByKey(users, 'id'); // [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
 * ```
 */
export const getUniqueByKey = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Sort array and remove duplicates in one operation
 *
 * @param array - Input array
 * @param compareFn - Optional compare function for custom sorting
 * @returns Sorted array without duplicates
 *
 * @example
 * ```ts
 * const sorted = uniqueSorted([3, 1, 2, 1, 3]); // [1, 2, 3]
 * ```
 */
export const uniqueSorted = <T>(
  array: T[],
  compareFn?: (a: T, b: T) => number
): T[] => {
  return Array.from(new Set(array)).sort(compareFn);
};

/**
 * Group array items by a key
 *
 * @param array - Input array of objects
 * @param key - Key to group by
 * @returns Object with grouped items
 *
 * @example
 * ```ts
 * const projects = [
 *   { category: "Frontend", name: "App" },
 *   { category: "Backend", name: "API" },
 *   { category: "Frontend", name: "Site" }
 * ];
 * const grouped = groupBy(projects, 'category');
 * // { Frontend: [{...}, {...}], Backend: [{...}] }
 * ```
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Chunk array into smaller arrays of specified size
 *
 * @param array - Input array
 * @param size - Chunk size
 * @returns Array of chunks
 *
 * @example
 * ```ts
 * const chunked = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * ```
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Shuffle array randomly (Fisher-Yates algorithm)
 *
 * @param array - Input array
 * @returns New shuffled array (original unchanged)
 *
 * @example
 * ```ts
 * const shuffled = shuffle([1, 2, 3, 4, 5]);
 * ```
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Remove falsy values from array
 *
 * @param array - Input array
 * @returns Array without null, undefined, false, 0, ""
 *
 * @example
 * ```ts
 * const compact = compactArray([1, null, 2, undefined, 3, false, 0, ""]); // [1, 2, 3]
 * ```
 */
export const compactArray = <T>(array: (T | null | undefined | false | 0 | "")[]): T[] => {
  return array.filter(Boolean) as T[];
};
