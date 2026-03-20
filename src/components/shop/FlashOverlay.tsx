'use client';
import { useEffect, useState } from 'react';

interface FlashOverlayProps {
  trigger: number; // increment to trigger flash
  color?: string;
}

export function FlashOverlay({ trigger, color = 'white' }: FlashOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 animate-flash"
      style={{ background: color }}
    />
  );
}
