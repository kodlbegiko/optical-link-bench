# Current Production Site

Production project: **Optical Link**.

## Intended endpoints

- Project / research home: `https://optical-link-bench.vercel.app/`
- Current benchmark TX: `https://optical-link-bench.vercel.app/bench.html#tx`
- Current benchmark RX: `https://optical-link-bench.vercel.app/bench.html#rx`
- Compatibility alias: `https://optical-link-bench.vercel.app/v0208.html`

## Current benchmark generation

The preserved benchmark generation is **V0.20.8**.

It retains:

- fixed `1000 B × 8 QR/s` transmitter;
- 12 / 18 / 24 Hz decoder-sampling modes;
- camera-driven 90 s mode;
- camera-driven 300 s endurance;
- bundled same-origin `qrcode` + `jsQR` dependencies;
- compact TX/RX UI.

`src/app.js` remains the readable benchmark source.

## New project site

The root route is now intended to explain the broader Optical Link program:

- why QR remains the bootstrap/baseline;
- proposed Optical HS binary-grid architecture;
- useful-goodput success criteria;
- staged roadmap;
- explicit risks and non-claims.

The website does **not** present Optical HS targets as achieved results.

## Next evidence-producing step

Before implementing the first custom codec, complete Measurement Integrity work and a clean counterbalanced decoder-sampling experiment. The latest completed long-duration quantitative evidence remains V0.19 until a newer run is completed and recorded.
