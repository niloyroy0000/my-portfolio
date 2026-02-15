import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export const useCountUp = ({
  end,
  duration = 2000,
  start = 0,
  decimals = 0,
  suffix = '',
  prefix = ''
}: UseCountUpOptions) => {
  const [count, setCount] = useState(start);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Animation function
    const runAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const startValue = start;
      const diff = end - startValue;

      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + diff * eased;

        setCount(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(tick);
        } else {
          setCount(end);
        }
      };

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          runAnimation();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Delay to ensure proper hydration
    const timeoutId = setTimeout(() => {
      observer.observe(element);

      // Check if already in viewport
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0 && !hasAnimatedRef.current) {
        runAnimation();
      }
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [end, duration, start]);

  // Handle end value changes (for async data)
  useEffect(() => {
    if (hasAnimatedRef.current && end !== count) {
      // Reset and re-animate if end value changed
      hasAnimatedRef.current = false;
      setCount(start);
    }
  }, [end, start, count]);

  const formattedCount = decimals > 0
    ? `${prefix}${count.toFixed(decimals)}${suffix}`
    : `${prefix}${Math.round(count)}${suffix}`;

  return { count: formattedCount, ref: elementRef };
};
