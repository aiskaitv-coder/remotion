// Stage / useTime runtime (export contract used by Claude Design video exporters):
//   <Stage width height duration fps autoPlay>   useTime() → seconds
//   window.__videoMeta = { width, height, duration, fps }   window.__seek(seconds)   ?__render=1 → no autoplay, exporter drives time
// Every frame of the animation is a pure function of the time value; no wall-clock motion anywhere else.
import React, { createContext, useContext, useEffect, useState } from "react";
const TimeCtx = createContext(0);
export function useTime() { return useContext(TimeCtx); }
export function Stage({ width, height, duration, fps = 60, autoPlay = false, loop = true, children }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    window.__videoMeta = { width, height, duration, fps };
    window.__seek = (s) => setT(Math.min(Math.max(s, 0), duration));
    const renderMode = new URLSearchParams(location.search).get('__render') === '1';
    if (!autoPlay || renderMode) return;
    let raf, t0 = performance.now();
    const step = () => { const s = (performance.now() - t0) / 1000; setT(loop ? s % duration : Math.min(s, duration)); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [width, height, duration, fps, autoPlay, loop]);
  return <TimeCtx.Provider value={t}><div style={{ width, height, overflow: 'hidden', position: 'relative' }}>{children}</div></TimeCtx.Provider>;
}
export default Stage;
