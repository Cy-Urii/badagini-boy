'use client';
import { useState, useCallback } from 'react';
import { GamePhase } from '@/types/game';
import { BootSequence } from './boot/BootSequence';
import { MainMenu } from './menu/MainMenu';
import { GameScreen } from './game/GameScreen';
import { TreatShop } from './shop/TreatShop';
import { ScanlineOverlay } from './ui/ScanlineOverlay';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { GameLoadScreen } from './boot/GameLoadScreen';

export function GameShell() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.BOOT);
  const [loading, setLoading] = useState(false);
  const { isReady, initOnGesture } = useAudioEngine();

  const handleInteraction = useCallback(async () => {
    if (!isReady) await initOnGesture();
  }, [isReady, initOnGesture]);

  const handleBootComplete = useCallback(async () => {
    await initOnGesture();
    setPhase(GamePhase.MENU);
  }, [initOnGesture]);

  const handleMenuStart = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhase(GamePhase.GAME);
    }, 2200);
  }, []);

  const handleCashOut = useCallback(() => {
    setPhase(GamePhase.SHOP);
  }, []);

  const handleShopBack = useCallback(() => {
    setPhase(GamePhase.GAME);
  }, []);

  return (
    <div
      className="min-h-screen bg-black text-white overflow-hidden"
      onClick={handleInteraction}
    >
      <ScanlineOverlay />
      {phase === GamePhase.BOOT && <BootSequence onComplete={handleBootComplete} />}
      {phase === GamePhase.MENU && !loading && (
        <MainMenu onStart={handleMenuStart} audioReady={isReady} />
      )}
      {phase === GamePhase.MENU && loading && <GameLoadScreen />}
      {phase === GamePhase.GAME && <GameScreen onCashOut={handleCashOut} />}
      {phase === GamePhase.SHOP && <TreatShop onBack={handleShopBack} />}
    </div>
  );
}
