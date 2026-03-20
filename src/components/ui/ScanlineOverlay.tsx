'use client';

export function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 2px)',
      }}
    />
  );
}
