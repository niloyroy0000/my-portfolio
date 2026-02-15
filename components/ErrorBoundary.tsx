"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { FaExclamationCircle, FaHome, FaSync } from "@/lib/icons";

/**
 * ErrorBoundary - Catches and displays component errors gracefully
 * Styled to match site design system with cyan accent colors
 */

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  isChunkError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Detect chunk loading errors (common on slow mobile networks)
    const isChunkError = error.name === 'ChunkLoadError' ||
                        error.message?.includes('Loading chunk') ||
                        error.message?.includes('Failed to fetch dynamically imported module');

    return { hasError: true, error, isChunkError };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Track chunk errors for debugging
    if (this.state.isChunkError) {
      console.warn('Chunk loading failed - likely slow network or timeout');
    }
  }

  handleRetry = () => {
    // For chunk errors, reload the page to retry downloading
    if (this.state.isChunkError) {
      window.location.reload();
    } else {
      this.setState({ hasError: false, error: undefined, isChunkError: false });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI - matches site design system
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-secondary-default/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-md mx-auto">
            {/* Card container */}
            <div className="bg-white/5 border border-secondary-default/20 rounded-xl p-8 backdrop-blur-sm">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary-default/10 border border-secondary-default/20 rounded-xl flex items-center justify-center">
                <FaExclamationCircle className="text-4xl text-secondary-default/70" aria-hidden="true" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h2>

              {/* Description */}
              <p className="text-white/60 mb-6">
                {this.state.isChunkError
                  ? "Slow connection detected. Some content failed to download. Click retry to continue."
                  : this.props.section
                  ? `There was an error loading the ${this.props.section} section.`
                  : "An unexpected error occurred. Please try again."}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 bg-secondary-default hover:bg-secondary-default/80 text-primary font-medium px-5 py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
                >
                  <FaSync className="text-sm" aria-hidden="true" />
                  Try Again
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/20 hover:border-white/30 font-medium px-5 py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1f]"
                >
                  <FaHome className="text-sm" aria-hidden="true" />
                  Return Home
                </Link>
              </div>

              {/* Development error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-white/50 cursor-pointer hover:text-white/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 p-4 bg-secondary-default/10 border border-secondary-default/20 rounded-lg text-xs text-secondary-default/80 overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
