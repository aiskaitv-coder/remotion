# Claude2Video — Stage Export Format (what the bundled runtime implements)

Source: the user-supplied "Claude2Video — Stage Export Format" instructions (2026-09-05). The runtime in
`assets/stage-runtime/animations.jsx` and the entry produced by `scripts/build_stage_html.sh` satisfy every line:

| Requirement | Where it is met |
|---|---|
| `window.Stage` and `window.useTime` are functions before mount | entry script assigns both, then calls `createRoot` |
| Mount via `createRoot` into `#root` with rendered children | entry; Stage renders its canvas div synchronously |
| Exactly one `<Stage>`; `type.name === 'Stage'` preserved | one Stage in the JSX component; esbuild bundle is not minified |
| `width`, `height`, `duration` numeric props | from the production JSON canvas and `total_duration_ms / 1000` |
| First two `useState` in Stage: `time` (number, s) then `playing` (boolean) | `animations.jsx`, in that order, unconditional |
| `useTime()` returns `time`; all motion derives from it | context; the engine renders `render(t)` in an effect on `t` |
| No hidden rAF / Date.now() / CSS keyframes | the only rAF advances `time` while `playing`; the engine is time-pure |
| Scene in one div with inline `transform: scale(...)` and matching width/height | Stage's canvas div |
| Single self-contained `.html`, React inline, no JSX in plain scripts | esbuild bundle inlined; fonts as data URIs |

Verification used in this repo (`web/test/stage/verify_contract.mjs`): walk the React fiber tree from `#root`,
find the Stage fiber, read `memoizedProps` and the first two hook states, dispatch `false` on the second queue and
a timestamp on the first, then capture; frames must equal the approved review stills (max diff 0).

Hand-off line for the user: upload the `.html` (or the project `.zip`) to https://claude2video.com/ to render the MP4.
