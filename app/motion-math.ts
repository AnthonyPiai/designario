/** Progress is derived from actual marker positions, so wrapped text and mobile layouts stay in sync. */
export function timelineState(markerPositions: number[], focusLine: number) {
  if (!markerPositions.length) return { progress: 0, active: 0 };
  const start = markerPositions[0];
  const end = markerPositions[markerPositions.length - 1];
  const progress =
    end > start
      ? Math.max(0, Math.min(1, (focusLine - start) / (end - start)))
      : Number(focusLine >= start);
  const active = Math.max(
    0,
    markerPositions.findLastIndex((position) => position <= focusLine),
  );
  return { progress, active };
}

/** Time-based easing behaves consistently on 60 Hz and high-refresh displays. */
export function easeValue(current: number, target: number, elapsedMs: number) {
  if (Math.abs(target - current) < 0.002) return target;
  const weight = 1 - Math.exp(-Math.max(0, Math.min(64, elapsedMs)) / 95);
  return current + (target - current) * weight;
}
