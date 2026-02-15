"use client";

import React, { ReactNode, Suspense, useId } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PERFORMANCE_VARIANTS } from "@/constants";
import { IconType } from "@/lib/icons";
import { FaCheck, FaExclamationCircle } from "@/lib/icons";

type FormFieldType = "text" | "email" | "tel" | "password" | "textarea";

interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder: string;
  required?: boolean;
  value: string;
  error?: string;
  className?: string;
  rows?: number; // For textarea
  maxLength?: number; // Character limit
  icon?: IconType; // Optional field icon
  isValid?: boolean; // Real-time validation state
  hint?: string; // Field requirement hint (e.g., "Min 2 characters")
}

interface FormSectionProps {
  title?: string;
  description?: string;
  fields: FormField[];
  onFieldChange: (fieldName: string, value: string) => void;
  className?: string;
  children?: ReactNode;
  layout?: "single" | "grid"; // single column or 2-column grid
}

const FormSection: React.FC<FormSectionProps> = ({
  fields,
  onFieldChange,
  className = "",
  children,
  layout = "single"
}) => {
  const formId = useId();

  const renderField = (field: FormField, fieldIndex: number) => {
    // Generate unique IDs for accessibility
    const fieldId = `${formId}-${field.name}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    // Determine validation state for styling
    const hasValue = field.value && field.value.trim().length > 0;
    const showValidState = hasValue && field.isValid && !field.error;
    // Show error state when: has explicit error OR (has value but not valid for required fields)
    const showErrorState = field.error || (hasValue && field.isValid === false && field.required);

    // Gradient border wrapper classes (reduced opacity for subtlety)
    // Focus: Cyan+Purple+Pink gradient | Valid: Emerald+Cyan+Purple gradient | Error: Red
    const getGradientWrapperClasses = () => {
      if (showErrorState) {
        return 'bg-red-500/40';
      }
      if (showValidState) {
        // Success: Emerald -> Cyan -> little Purple (50-60% opacity)
        return 'bg-gradient-to-r from-emerald-500/60 via-[#00BFFF]/50 to-purple-500/30';
      }
      // Default/Focus state uses Cyan+Purple+Pink
      return 'bg-gradient-to-r from-[#00BFFF]/60 via-purple-500/40 to-pink-500/50';
    };

    // Input styling - subtle default border, gradient overlay on focus/valid
    const baseInputClasses = `
      bg-[#1e1e24]
      border border-white/10
      hover:border-white/20
      text-white placeholder:text-white/30
      focus:outline-none
      focus-visible:outline-none
      focus-visible:ring-0
      focus:border-transparent
      transition-all duration-300 ease-out
      rounded-lg
      w-full
      ${field.icon ? 'pl-10' : 'pl-3'}
      pr-10
      py-2
      ${showValidState || showErrorState ? 'border-transparent' : ''}
      ${field.className || ''}
    `.trim().replace(/\s+/g, ' ');

    const IconComponent = field.icon;

    // Build aria-describedby value
    const ariaDescribedBy = [
      field.error ? errorId : null,
      field.hint && !field.isValid ? hintId : null
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div
        key={field.name}
        data-testid={`form-field-${field.name}`}
        className="space-y-2"
      >
        <label
          htmlFor={fieldId}
          data-testid={`form-label-${field.name}`}
          className="text-sm font-medium text-white/80"
        >
          {field.label}
          {field.required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
          {field.required && <span className="sr-only">(required)</span>}
        </label>

        {field.type === "textarea" ? (
          <div className="relative group/field">
            {/* Gradient border wrapper - shows on focus or when valid/error */}
            <div className={`
              absolute -inset-[1px] rounded-lg opacity-0 transition-opacity duration-300
              group-focus-within/field:opacity-100
              ${showValidState || showErrorState ? 'opacity-100' : ''}
              ${getGradientWrapperClasses()}
            `} />
            {/* Inner wrapper for positioning */}
            <div className="relative">
              {IconComponent && (
                <div className={`absolute left-3 top-3 z-10 pointer-events-none transition-colors duration-300 ${
                  showErrorState ? 'text-red-400' : showValidState ? 'text-emerald-400' : 'text-white/30 group-focus-within/field:text-purple-400'
                }`} aria-hidden="true">
                  <Suspense fallback={<div className="w-4 h-4" />}>
                    <IconComponent className="w-4 h-4" />
                  </Suspense>
                </div>
              )}
              <Textarea
                id={fieldId}
                data-testid={`form-textarea-${field.name}`}
                className={`${baseInputClasses} resize-none ${IconComponent ? 'pl-10 pt-3' : 'pt-3'}`}
                style={{ height: field.rows ? `${field.rows * 24}px` : '150px' }}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                maxLength={field.maxLength}
                aria-invalid={showErrorState ? true : undefined}
                aria-describedby={ariaDescribedBy}
                aria-required={field.required}
              />
              {/* Validation indicator for textarea - always emerald for check */}
              {hasValue && (showErrorState || showValidState) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 top-3 z-10 pointer-events-none flex items-center justify-center"
                  aria-hidden="true"
                >
                  {showErrorState ? (
                    <FaExclamationCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <FaCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative group/field">
            {/* Gradient border wrapper - shows on focus or when valid/error */}
            <div className={`
              absolute -inset-[1px] rounded-lg opacity-0 transition-opacity duration-300
              group-focus-within/field:opacity-100
              ${showValidState || showErrorState ? 'opacity-100' : ''}
              ${getGradientWrapperClasses()}
            `} />
            {/* Inner wrapper for positioning */}
            <div className="relative">
              {IconComponent && (
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors duration-300 ${
                  showErrorState ? 'text-red-400' : showValidState ? 'text-emerald-400' : 'text-white/30 group-focus-within/field:text-purple-400'
                }`} aria-hidden="true">
                  <Suspense fallback={<div className="w-4 h-4" />}>
                    <IconComponent className="w-4 h-4" />
                  </Suspense>
                </div>
              )}
              <Input
                id={fieldId}
                data-testid={`form-input-${field.name}`}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                className={baseInputClasses}
                maxLength={field.maxLength}
                aria-invalid={showErrorState ? true : undefined}
                aria-describedby={ariaDescribedBy}
                aria-required={field.required}
              />
              {/* Validation indicator for input - always emerald for check */}
              {hasValue && (showErrorState || showValidState) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-3 inset-y-0 z-10 pointer-events-none flex items-center justify-center"
                  aria-hidden="true"
                >
                  {showErrorState ? (
                    <FaExclamationCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <FaCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {field.error ? (
          <p
            id={errorId}
            role="alert"
            data-testid={`form-error-${field.name}`}
            className="text-red-400 text-xs"
          >
            {field.error}
          </p>
        ) : field.hint && !field.isValid ? (
          <p
            id={hintId}
            data-testid={`form-hint-${field.name}`}
            className="text-white/30 text-[10px]"
          >
            {field.hint}
          </p>
        ) : null}
      </div>
    );
  };

  // Group fields for layout
  const groupFields = () => {
    if (layout === "single") {
      return fields.map(field => [field]);
    }
    
    // Grid layout - group fields into pairs
    const groups = [];
    for (let i = 0; i < fields.length; i += 2) {
      groups.push(fields.slice(i, i + 2));
    }
    return groups;
  };

  const fieldGroups = groupFields();

  return (
    <div 
      data-testid="form-section"
      className={`space-y-6 ${className}`}
    >

      {/* Form Fields */}
      <div 
        data-testid="form-fields-container"
        className="space-y-6"
      >
        {fieldGroups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            data-testid={`form-field-group-${groupIndex}`}
            variants={PERFORMANCE_VARIANTS.slideUpSync}
            className={
              layout === "grid" && group.length > 1
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "space-y-6"
            }
          >
            {group.map((field, idx) => renderField(field, idx))}
          </motion.div>
        ))}
      </div>

      {/* Additional Content */}
      {children && (
        <motion.div 
          data-testid="form-additional-content"
          variants={PERFORMANCE_VARIANTS.fadeInFast}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export default FormSection; 