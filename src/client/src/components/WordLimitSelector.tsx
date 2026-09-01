import { useState, useRef, useEffect, FC, Dispatch, SetStateAction, KeyboardEvent } from 'react';

interface WordLimitSelectorProps {
  top: number;
  setTop: Dispatch<SetStateAction<number>>;
}

export const WordLimitSelector: FC<WordLimitSelectorProps> = ({
  top,
  setTop,
}) => {
  const [typeBuffer, setTypeBuffer] = useState<string>('');
  const numRef = useRef<HTMLSpanElement>(null);

  // Passive wheel listener for interactive span to avoid scrolling and change limit
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        setTop((prev) => prev + 1);
      } else if (e.deltaY > 0) {
        setTop((prev) => Math.max(1, prev - 1));
      }
      setTypeBuffer('');
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [setTop]);

  // Keyboard handlers for interactive span
  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setTop((prev) => prev + 1);
      setTypeBuffer('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setTop((prev) => Math.max(1, prev - 1));
      setTypeBuffer('');
    } else if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const newBuffer = typeBuffer + e.key;
      setTypeBuffer(newBuffer);
      setTop(parseInt(newBuffer) || 1);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      const newBuffer = typeBuffer.slice(0, -1);
      setTypeBuffer(newBuffer);
      setTop(newBuffer ? parseInt(newBuffer) || 1 : 1);
    } else if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      (e.target as HTMLSpanElement).blur();
    }
  };

  const handleBlur = () => {
    setTypeBuffer('');
  };

  return (
    <span
      ref={numRef}
      className="highlight-num"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      data-testid="interactive-num"
      title="Scroll, arrow keys or type digits directly to change"
    >
      {top}
    </span>
  );
};
