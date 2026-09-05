// Minimal shim of the Claude Design Stage/useTime contract, for local verification only.
// Real Claude Design projects supply their own animations.jsx; this one implements the documented surface:
// <Stage width height duration fps autoPlay>, useTime() in seconds, window.__seek(t), window.__videoMeta.
import React, { createContext, useContext, useEffect, useState } from "react";
const TimeCtx = createContext(0);
export function useTime() { return useContext(TimeCtx); }
export function Stage({ width, height, duration, fps = 60, autoPlay = false, children }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    window.__videoMeta = { width, height, duration, fps };
    window.__seek = (s) => setT(Math.min(Math.max(s, 0), duration));
    const render = new URLSearchParams(location.search).get('__render') === '1';
    if (!autoPlay || render) return;                       // exporter drives time via __seek
    let raf, t0 = performance.now();
    const loop = () => { setT(((performance.now() - t0) / 1000) % duration); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
  }, [width, height, duration, fps, autoPlay]);
  return <TimeCtx.Provider value={t}><div style={{ width, height, overflow: 'hidden' }}>{children}</div></TimeCtx.Provider>;
}
