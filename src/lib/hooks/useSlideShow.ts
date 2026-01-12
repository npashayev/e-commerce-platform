'use client';
import { useEffect, useState, useRef, useCallback } from 'react';

interface UseSlideshowOptions {
  length: number;
  time?: number;
  initialIsActive?: boolean;
  resetOnInactive?: boolean;
}

const useSlideshow = ({
  length,
  time = 5000,
  initialIsActive = true,
  resetOnInactive = false,
}: UseSlideshowOptions) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualReset, setManualReset] = useState(0);
  const isActiveRef = useRef(initialIsActive);

  const setActive = useCallback(
    (value: boolean) => {
      isActiveRef.current = value;

      if (!value && resetOnInactive) {
        setActiveIndex(0);
      }
    },
    [resetOnInactive],
  );

  const resetTimer = () => {
    setManualReset(prev => prev + 1);
  };

  const increaseIndex = useCallback(() => {
    if (!length) return;
    setActiveIndex(prev => (prev + 1) % length);
    resetTimer();
  }, [length]);

  const decreaseIndex = useCallback(() => {
    if (!length) return;
    setActiveIndex(prev => (prev - 1 + length) % length);
    resetTimer();
  }, [length]);

  useEffect(() => {
    if (!length || length <= 1) return;

    const changeActiveIndex = () => {
      if (!isActiveRef.current) return;
      setActiveIndex(prev => (prev + 1) % length);
    };

    const interval = window.setInterval(changeActiveIndex, time);
    return () => window.clearInterval(interval);
  }, [length, time, manualReset]);

  return {
    activeIndex,
    increaseIndex,
    decreaseIndex,
    setActive,
  };
};

export default useSlideshow;
