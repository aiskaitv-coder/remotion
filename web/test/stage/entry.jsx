import React from "react"; import { createRoot } from "react-dom/client";
import DataStoryAnergia from "./DATA_STORY_ANERGIA.stage.jsx";
window.__frameReady = false; window.__pageError = null;
window.addEventListener('error', e => { window.__pageError = String(e.message); });
window.addEventListener('unhandledrejection', e => { window.__pageError = String(e.reason && (e.reason.message || e.reason)); });
createRoot(document.getElementById('root')).render(<DataStoryAnergia />);
