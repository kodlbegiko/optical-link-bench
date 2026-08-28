# Current Production Sites

The project now uses **two production surfaces** so the research/vision website can evolve without destabilizing the benchmark harness.

## 1. Optical Link project website

- Home: `https://optical-link.vercel.app/`
- Vercel project: `optical-link`
- Purpose: product thesis, architecture, evidence, roadmap, Optical HS proposal and risk model.

The project site links back to the preserved benchmark rather than bundling a second copy of the benchmark runtime.

## 2. Optical Link Bench

- Current benchmark base: `https://optical-link-bench.vercel.app/v0208.html`
- TX: `https://optical-link-bench.vercel.app/v0208.html#tx`
- RX: `https://optical-link-bench.vercel.app/v0208.html#rx`
- Vercel project: `optical-link-bench`

The preserved benchmark generation is **V0.20.8**.

It retains:

- fixed `1000 B × 8 QR/s` transmitter;
- 12 / 18 / 24 Hz decoder-sampling modes;
- camera-driven 90 s mode;
- camera-driven 300 s endurance;
- bundled same-origin `qrcode` + `jsQR` dependencies;
- compact TX/RX UI.

`src/app.js` remains the readable benchmark source in this repository.

## What the new site represents

The website explains the broader Optical Link research program:

- QR remains the universal bootstrap and matched baseline;
- Optical HS is a proposed high-speed payload mode, beginning with a persistent-locator binary grid;
- useful-file goodput, integrity and repeatability are the success criteria;
- 50 / 200 / 300 / 500 KB/s and 1 MB/s are **research gates/targets, not achieved results**;
- known failure modes and non-claims are explicit.

## Deployment verification — 2026-08-28

The `optical-link` production deployment reached `READY` and the canonical alias `https://optical-link.vercel.app/` returned HTTP 200. The stylesheet endpoint was also fetched successfully.

## Next evidence-producing step

Before implementing the first custom codec, complete Measurement Integrity work and a clean counterbalanced decoder-sampling experiment. The latest completed long-duration quantitative evidence remains V0.19 until a newer run is completed and recorded.
