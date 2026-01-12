'use client';
import { useEffect, useRef } from 'react';

interface ElementConfig {
  contentRef: React.RefObject<HTMLElement | null>;
  toggleRef?: React.RefObject<HTMLElement | null>;
  onClickOutside: () => void;
}

const useClickOutside = (elements: ElementConfig[]) => {
  const elementsRef = useRef(elements);

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      for (const { contentRef, toggleRef, onClickOutside } of elementsRef.current) {
        const target = e.target as Node;

        const insideContent = contentRef.current?.contains(target);
        const insideToggle = toggleRef?.current?.contains(target);

        if (!insideContent && !insideToggle) {
          onClickOutside();
          break;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
};

export default useClickOutside;
