'use client';

export function BlinkingCursor({ text = '█' }: { text?: string }) {
  return <span className="animate-blink">{text}</span>;
}
