// Stage runtime entry: React 18 + Stage/useTime + the DATA STORY timeline component.
// Bundled ONCE (no minification, production React) into assets/stage-runtime.bundle.js so the dependency-free
// Python builder can emit a Claude2Video-ready HTML by concatenating: fonts css, production JSON, engine.js, this bundle.
// Runtime inputs: window.DATA_STORY_PRODUCTION (JSON), window.DataStoryEngine (locked engine), a <div id="root">.
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, useTime } from "./animations.jsx";

// Claude2Video readyMarker: both globals must be functions before the tree mounts.
window.Stage = Stage; window.useTime = useTime;

const PRODUCTION = window.DATA_STORY_PRODUCTION;
const WIDTH = PRODUCTION.canvas.width, HEIGHT = PRODUCTION.canvas.height, FPS = PRODUCTION.canvas.fps;
const DURATION = PRODUCTION.total_duration_ms / 1000;

function DataStoryTimeline() {
  const t = useTime();                          // seconds on the Stage playhead
  const host = useRef(null), player = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {                             // mount the locked engine once, after the fonts resolve
    let cancelled = false;
    window.DataStoryEngine.ready().then(() => {
      if (cancelled || !host.current) return;
      player.current = window.DataStoryEngine.mountStory(host.current, PRODUCTION);
      setReady(true); window.__frameReady = true;
    });
    return () => { cancelled = true; if (host.current) host.current.innerHTML = ""; player.current = null; };
  }, []);
  useEffect(() => {                             // one deterministic frame per time value
    if (!ready || !player.current) return;
    player.current.render(Math.min(Math.max(t, 0), DURATION - 1 / FPS));
  }, [t, ready]);
  return <div ref={host} style={{ width: WIDTH, height: HEIGHT, position: "relative", overflow: "hidden", background: "#121B37" }} />;
}

window.__frameReady = false; window.__pageError = null;
window.addEventListener('error', e => { window.__pageError = String(e.message); });
window.addEventListener('unhandledrejection', e => { window.__pageError = String(e.reason && (e.reason.message || e.reason)); });

createRoot(document.getElementById('root')).render(
  <Stage width={WIDTH} height={HEIGHT} duration={DURATION} fps={FPS} autoPlay loop={false}>
    <DataStoryTimeline />
  </Stage>
);
