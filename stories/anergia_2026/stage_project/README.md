# DATA STORY · Ανεργία (Ιούλιος 2026) · Stage-based export package

| Αρχείο | Ρόλος |
|---|---|
| `index.html` | Αυτόνομη σελίδα: React 18 + Stage/useTime runtime + κλειδωμένος engine + δεδομένα. Ανοίγει παντού, autoplay. `?__render=1` απενεργοποιεί το autoplay για exporter που οδηγεί τον χρόνο με `window.__seek(s)`. Εκθέτει `window.__videoMeta = {width:1080,height:1920,duration:71.08,fps:25}`. |
| `DATA_STORY_ANERGIA.stage.jsx` | Το component για Claude Design project: `<Stage width={1080} height={1920} duration={71.08} fps={25} autoPlay>`, κάθε καρέ από `useTime()`. Import: `./animations.jsx`. |
| `animations.jsx` | Runtime Stage/useTime που υλοποιεί το contract. Αν το project σου έχει δικό του starter με τα ίδια exports, κράτα το δικό σου. |
| `DATA_STORY_ANERGIA_PRODUCTION.json` | Τα δεδομένα (facts, sources, scenes). Ταυτόσημα με τα ενσωματωμένα. |

Κανόνες exportability που τηρούνται: κανένα CSS keyframe, κανένα Date.now()/Math.random(), κάθε pixel συνάρτηση του `useTime()`. Επαληθεύτηκε: καρέ μέσω `__seek` στα 0 / 30,70 / 70,38 s ταυτόσημα (max diff 0) με τα εγκεκριμένα stills.
