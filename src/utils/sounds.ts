/**
 * Web Audio feedback for storefront and admin.
 */
function getAudioContext(): AudioContext | null {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    return Ctx ? new Ctx() : null;
  } catch {
    return null;
  }
}

function playTone(freq: number, duration: number, gainValue: number, type: OscillatorType = 'sine'): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playAddToCartSound(): void {
  playTone(880, 0.15, 0.08);
}

/** Admin alert when a new order arrives */
export function playNewOrderSound(): void {
  playTone(523.25, 0.12, 0.1);
  window.setTimeout(() => playTone(659.25, 0.18, 0.09, 'triangle'), 120);
}
