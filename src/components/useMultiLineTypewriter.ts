"use client";

import { useEffect, useState } from "react";

/**
 * Types out several lines in sequence, one character at a time.
 * `rendered[i]` is the visible slice of lines[i] so far; `activeIndex`
 * is the line currently being typed (-1 once everything is done).
 */
export function useMultiLineTypewriter(
  lines: string[],
  speed = 24,
  gapBetweenLines = 250,
  // When true, skips the animation entirely and renders the finished
  // state immediately — used so repeat visits don't replay the intro.
  skip = false
) {
  const [rendered, setRendered] = useState<string[]>(() =>
    skip ? [...lines] : lines.map(() => "")
  );
  const [activeIndex, setActiveIndex] = useState(skip ? -1 : 0);
  const [done, setDone] = useState(skip);

  useEffect(() => {
    if (skip) return;

    let cancelled = false;
    let charTimer: ReturnType<typeof setTimeout>;
    let gapTimer: ReturnType<typeof setTimeout>;

    function typeLine(lineIdx: number, charIdx: number) {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        setActiveIndex(-1);
        setDone(true);
        return;
      }
      const line = lines[lineIdx];
      if (charIdx > line.length) {
        gapTimer = setTimeout(() => typeLine(lineIdx + 1, 0), gapBetweenLines);
        return;
      }
      setActiveIndex(lineIdx);
      setRendered((prev) => {
        const next = [...prev];
        next[lineIdx] = line.slice(0, charIdx);
        return next;
      });
      charTimer = setTimeout(() => typeLine(lineIdx, charIdx + 1), speed);
    }

    typeLine(0, 0);

    return () => {
      cancelled = true;
      clearTimeout(charTimer);
      clearTimeout(gapTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  return { rendered, activeIndex, done };
}
