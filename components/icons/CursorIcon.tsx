import React, { useId } from 'react';

interface CursorIconProps {
  className?: string;
}

const CursorIcon: React.FC<CursorIconProps> = ({ className }) => {
  // Use React's useId hook instead of Math.random() to avoid hydration mismatches
  const uniqueId = useId();
  
  return (
    <svg 
      height="1em" 
      style={{ flexShrink: 0, lineHeight: 1 }} 
      viewBox="0 0 24 24" 
      width="1em" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Cursor</title>
      <path d="M11.925 24l10.425-6-10.425-6L1.5 18l10.425 6z" fill={`url(#${uniqueId}-fill-0)`}></path>
      <path d="M22.35 18V6L11.925 0v12l10.425 6z" fill={`url(#${uniqueId}-fill-1)`}></path>
      <path d="M11.925 0L1.5 6v12l10.425-6V0z" fill={`url(#${uniqueId}-fill-2)`}></path>
      <path d="M22.35 6L11.925 24V12L22.35 6z" fill="#0088b3"></path>
      <path d="M22.35 6l-10.425 6L1.5 6h20.85z" fill="#00bfff"></path>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id={`${uniqueId}-fill-0`} x1="11.925" x2="11.925" y1="12" y2="24">
          <stop offset=".16" stopColor="#00bfff" stopOpacity=".6"></stop>
          <stop offset=".658" stopColor="#00bfff" stopOpacity=".9"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id={`${uniqueId}-fill-1`} x1="22.35" x2="11.925" y1="6.037" y2="12.15">
          <stop offset=".182" stopColor="#00bfff" stopOpacity=".5"></stop>
          <stop offset=".715" stopColor="#00bfff" stopOpacity=".3"></stop>
        </linearGradient>
        <linearGradient gradientUnits="userSpaceOnUse" id={`${uniqueId}-fill-2`} x1="11.925" x2="1.5" y1="0" y2="18">
          <stop stopColor="#00bfff" stopOpacity=".8"></stop>
          <stop offset=".667" stopColor="#00bfff" stopOpacity=".4"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CursorIcon; 