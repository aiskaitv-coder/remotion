// Stage / useTime runtime implementing the Claude2Video Stage Export Format:
//   • window.Stage and window.useTime are functions before the React tree mounts (set by the entry script)
//   • exactly one <Stage width height duration> (numbers); type.name === 'Stage' (never minified/wrapped)
//   • the FIRST two useState calls inside Stage are [time, setTime] (seconds) then [playing, setPlaying] (boolean)
//   • useTime() returns the current time from context; all motion derives from it
//   • the scene lives in one div with inline transform: scale(1) and width/height matching the props
//   • the only requestAnimationFrame here advances the `time` state while `playing`; the exporter pauses and seeks
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
const TimeCtx = createContext(0);
export function useTime() { return useContext(TimeCtx); }
export function Stage({ width, height, duration, fps = 25, autoPlay = true, loop = true, children }) {
  const [time, setTime] = useState(0);                                              // 1st hook: number, seconds
  const [playing, setPlaying] = useState(autoPlay && !/[?&]__render=1/.test(location.search)); // 2nd hook: boolean
  const timeRef = useRef(0); timeRef.current = time;
  useEffect(() => {
    window.__videoMeta = { width, height, duration, fps };
    window.__seek = (s) => { setPlaying(false); setTime(Math.min(Math.max(s, 0), duration)); };
    window.__play = () => setPlaying(true);
  }, [width, height, duration, fps]);
  useEffect(() => {                                                                   // playhead: rAF only while playing
    if (!playing) return;
    const t0 = performance.now() - timeRef.current * 1000; let raf;
    const step = () => { const s = (performance.now() - t0) / 1000; setTime(loop ? s % duration : Math.min(s, duration)); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [playing, duration, loop]);
  return (
    <TimeCtx.Provider value={time}>
      <div style={{ width, height, transform: 'scale(1)', transformOrigin: '0 0', position: 'relative', overflow: 'hidden' }}>
        {children}
      </div>
    </TimeCtx.Provider>
  );
}
export default Stage;
