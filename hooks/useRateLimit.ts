import { useState, useCallback } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
  blockDurationMs: number; // How long to block after exceeding limit
}

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  isBlocked: boolean;
  blockUntil: number;
}

export const useRateLimit = (config: RateLimitConfig = {
  maxAttempts: 3,
  windowMs: 60000, // 1 minute
  blockDurationMs: 300000, // 5 minutes
}) => {
  const [state, setState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    isBlocked: false,
    blockUntil: 0,
  });

  const checkRateLimit = useCallback((): { allowed: boolean; message?: string; timeRemaining?: number } => {
    const now = Date.now();

    // Check if currently blocked
    if (state.isBlocked && now < state.blockUntil) {
      const timeRemaining = Math.ceil((state.blockUntil - now) / 1000);
      return {
        allowed: false,
        message: `Too many attempts. Please try again in ${Math.ceil(timeRemaining / 60)} minutes.`,
        timeRemaining,
      };
    }

    // Reset if block period has expired
    if (state.isBlocked && now >= state.blockUntil) {
      setState({
        attempts: 0,
        lastAttempt: 0,
        isBlocked: false,
        blockUntil: 0,
      });
      return { allowed: true };
    }

    // Reset attempts if window has expired
    if (now - state.lastAttempt > config.windowMs) {
      setState(prev => ({
        ...prev,
        attempts: 0,
        lastAttempt: now,
      }));
      return { allowed: true };
    }

    // Check if within rate limit
    if (state.attempts < config.maxAttempts) {
      return { allowed: true };
    }

    // Rate limit exceeded - block user
    setState(prev => ({
      ...prev,
      isBlocked: true,
      blockUntil: now + config.blockDurationMs,
    }));

    const timeRemaining = Math.ceil(config.blockDurationMs / 1000);
    return {
      allowed: false,
      message: `Rate limit exceeded. Please try again in ${Math.ceil(timeRemaining / 60)} minutes.`,
      timeRemaining,
    };
  }, [state, config]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    setState(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      lastAttempt: now,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      attempts: 0,
      lastAttempt: 0,
      isBlocked: false,
      blockUntil: 0,
    });
  }, []);

  const getRemainingAttempts = useCallback((): number => {
    if (state.isBlocked) return 0;
    return Math.max(0, config.maxAttempts - state.attempts);
  }, [state.attempts, state.isBlocked, config.maxAttempts]);

  const getTimeUntilReset = useCallback((): number => {
    if (state.isBlocked) {
      return Math.max(0, state.blockUntil - Date.now());
    }
    return Math.max(0, (state.lastAttempt + config.windowMs) - Date.now());
  }, [state.lastAttempt, state.blockUntil, state.isBlocked, config.windowMs]);

  return {
    checkRateLimit,
    recordAttempt,
    reset,
    getRemainingAttempts,
    getTimeUntilReset,
    isBlocked: state.isBlocked,
    attemptsRemaining: getRemainingAttempts(),
  };
};

export default useRateLimit; 