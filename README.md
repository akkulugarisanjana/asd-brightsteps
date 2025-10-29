# BrightSteps — Social & Emotion Coach (ASD)

A kid‑friendly, evidence‑informed React app to practice **Communication**, **Emotions**, and **Social Skills**, with a built‑in **Progress** tracker, **Teacher Mode** (PIN‑locked), **Low Sensory Mode**, **Visual Schedule**, **Pause/Repeat** on every activity, and a simple mini‑game **Turn‑Token Flyer** to rehearse waiting for turns.

> **Disclaimer**: This is an educational support tool. It does not diagnose or treat medical conditions.

## Features mapped to your requirements

- **Navigation order**: Communication → Emotions → Social Skills → Progress. Active tab is bold + underlined.
- **Touch targets**: Buttons ≥ 44×44 px.
- **Pause + Repeat** buttons on every activity card.
- **Teacher Mode (PIN)**: default `1234` (change before deploying). Hidden side panel holds:
  - Confetti (big wins only)
  - Adaptive difficulty (hook included – you can expand)
  - Sound on/off, **Mute** (disables volume slider)
  - Volume slider (grayed out when muted)
  - Low Sensory Mode (high contrast, reduced effects)
- **Kid‑friendly prompts** at ~2nd–3rd grade level with realistic answers.
- **Feedback**:
  - Correct: small star burst + short “pop” sound
  - Wrong: brief vibration + “warn” state
  - Confetti limited to wins (lightweight)
- **Progress tracker**:
  - Per‑category accuracy %
  - Average response time (s)
  - Progress bars
  - **Export CSV** of last trials
- **Visual Schedule** banner: **Now → Next → Done** to reduce anxiety.
- **Mini‑game**: *Turn‑Token Flyer* (Flappy‑style). Collect **My Turn** rings, avoid **Your Turn** rings.
- **Data & Tracking**: `localStorage` only (no network). Each trial records timestamp, domain, question id, correctness, response time (ms).
- **Adaptive Difficulty**: Hook provided; currently cycles items. Extend by shuffling choices, increasing choices, or reducing allowed time.

## Getting started

1. **Install** (Node 18+ recommended)

```bash
npm install
```

2. **Run**

```bash
npm run dev
```

Open the local URL Vite prints (e.g., http://localhost:5173).

3. **Build**

```bash
npm run build
npm run preview
```

## Customization

- Update prompts in `src/data/questions.js`.
- Change default Teacher PIN in `src/components/TeacherPanel.jsx`.
- Tweak sounds/animations in `src/components/ActivityCard.jsx` and `src/components/MiniGames/TurnTokenFlyer.jsx`.
- Replace star burst with a richer animation or integrate a small confetti lib if preferred.
- For multiple student profiles, back data with an API or IndexedDB and add a profile selector.

## Accessibility & UX

- Strong contrast, large fonts, icon+label, predictable layout.
- Low Sensory Mode desaturates colors and reduces effects.
- All interactive elements have ≥44×44 px targets and focus styles.
- Uses speech synthesis for **Repeat** (if available).

## License

MIT
