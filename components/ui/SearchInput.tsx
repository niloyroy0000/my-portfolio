"use client";

import React, { useId } from "react";
import { FiSearch, FiX } from "@/lib/icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
  testSelector?: string;
}

/**
 * SearchInput - Reusable search input component with clear button
 * Features:
 * - Search icon on the left
 * - Clear button (X) when text is present
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Focus states with cyan ring
 * - Responsive design
 */
const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  "aria-label": ariaLabel,
  testSelector
}) => {
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div
      className={`relative flex-1 group ${className}`}
      data-test-selector={testSelector}
    >
      {/* Screen reader label */}
      <label htmlFor={inputId} className="sr-only">
        {ariaLabel || placeholder}
      </label>

      {/* Search icon */}
      <div
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-default/70 group-focus-within:text-secondary-default transition-colors text-sm"
        aria-hidden="true"
      >
        <FiSearch />
      </div>

      {/* Input field */}
      <input
        id={inputId}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="w-full h-9 bg-gradient-to-br from-[#27272c] to-[#2a2a30] border border-secondary-default/30 rounded-lg pl-9 pr-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 focus:border-secondary-default/60 transition-all duration-300 shadow-sm focus:shadow-md focus:shadow-secondary-default/20"
        data-test-selector={testSelector ? `${testSelector}-input` : undefined}
      />

      {/* Clear button - only visible when there's text */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-red-400 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          data-test-selector={testSelector ? `${testSelector}-clear` : undefined}
          aria-label="Clear search"
        >
          <FiX className="text-sm" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
