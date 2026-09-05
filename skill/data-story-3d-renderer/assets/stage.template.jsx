// {{TITLE}}
// DATA STORY · DATA_STORY_3D_BRIGHT_V1 · Stage-based animation for Claude Design (export-ready).
//
// Contract: a single <Stage width height duration fps> wraps the scene; every frame is a pure function of
// useTime() (seconds). No wall clock, no CSS keyframes, no Math.random(). The locked engine below already
// renders any timestamp deterministically: render(t) draws the WebGL geometry and lays out the Greek text
// for exactly that t. The Stage drives it; the exporter can seek to any frame.
//
// Only this import line depends on your Claude Design project: Stage and useTime come from the animations.jsx
// starter that Claude Design adds to Stage-based projects. Adjust the path if your project keeps it elsewhere.
import React, { useEffect, useRef, useState } from "react";
import { Stage, useTime } from "./animations.jsx";

// ---- locked graphics engine (do not edit: SHA256-locked in the data-story-3d-renderer skill) ----
{{ENGINE_JS}}
// ---- end of locked engine ----

const FONTS_CSS = {{FONTS_CSS_JSON}};
const PRODUCTION = {{PRODUCTION_JSON}};

const WIDTH = PRODUCTION.canvas.width, HEIGHT = PRODUCTION.canvas.height, FPS = PRODUCTION.canvas.fps;
const DURATION = PRODUCTION.total_duration_ms / 1000;

let fontsInjected = false;
function injectFonts() {
  if (fontsInjected || typeof document === "undefined") return;
  const style = document.createElement("style"); style.setAttribute("data-datastory-fonts", "1");
  style.textContent = FONTS_CSS; document.head.appendChild(style); fontsInjected = true;
}

function DataStoryTimeline() {
  const t = useTime();                          // seconds on the Stage playhead
  const host = useRef(null);
  const player = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {                             // mount the locked engine once, after the fonts resolve
    injectFonts();
    let cancelled = false;
    window.DataStoryEngine.ready().then(() => {
      if (cancelled || !host.current) return;
      player.current = window.DataStoryEngine.mountStory(host.current, PRODUCTION);
      setReady(true);
    });
    return () => { cancelled = true; if (host.current) host.current.innerHTML = ""; player.current = null; };
  }, []);

  useEffect(() => {                             // one deterministic frame per time value
    if (!ready || !player.current) return;
    const clamped = Math.min(Math.max(t, 0), DURATION - 1 / FPS);
    player.current.render(clamped);
  }, [t, ready]);

  return <div ref={host} style={{ width: WIDTH, height: HEIGHT, position: "relative", overflow: "hidden", background: "#121B37" }} />;
}

export default function {{COMPONENT_NAME}}() {
  // Fixed duration and fps from the production JSON; autoplay with no user interaction.
  return (
    <Stage width={WIDTH} height={HEIGHT} duration={DURATION} fps={FPS} autoPlay autoplay loop={false}>
      <DataStoryTimeline />
    </Stage>
  );
}
