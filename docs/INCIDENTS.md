# Engineering Incidents and Lessons

This project accumulated several failures that materially affected the benchmark. They are documented because infrastructure bugs can masquerade as optical-channel failures.

## CDN dependency failure

### Symptom

The page displayed “necessary components failed to load” on iPhone.

### Cause

QRCode encoder and jsQR decoder were fetched from jsDelivr / unpkg at runtime. Both sources could be unavailable or blocked even when the main Vercel site loaded.

### Fix

V0.20.5+ bundles both libraries into same-origin application assets. V0.20.8 uses versioned same-origin assets.

### Lesson

A benchmark must not depend on a second network origin if that dependency can determine whether the experiment starts.

## False library readiness gate

### Symptom

The runtime reported QR libraries unavailable even after they were included in the application bundle.

### Cause

Readiness still checked `window.QRCode` / `window.jsQR`, while bundled modules were module-scoped rather than guaranteed globals.

### Fix

Remove the global gate; directly use imported/bundled modules.

## Production HTML referenced Preview JavaScript

### Symptom

Production loaded CSS/background but no UI.

### Cause

HTML referenced a protected Preview deployment asset. The Production page was public, but its JS dependency was not.

### Fix

Use only same-deployment / same-origin assets.

### Lesson

HTTP 200 on the HTML is not sufficient deployment QA. Required JS asset URLs must also be checked.

## JavaScript syntax error → blank UI

### Symptom

Only the background rendered; no controls appeared.

### Cause

An extra closing brace near `renderTx()` caused a syntax error (`Unexpected identifier 'let'`).

### Fix

Run `node --check` on generated JavaScript before deployment and split very large inline files into independently testable modules.

## `reduce()` initialization bug

### Symptom

Page initialized to a blank state.

### Cause

A duration calculation used an undefined identifier as the initial value of `reduce()` instead of `0`.

### Fix

Correct initial value and add syntax/runtime sanity checks.

## Packet field-count mismatch

### Symptom

TX appeared to run but RX rejected valid Data packets.

### Cause

The Data packet actually contained eight parsed fields while the receiver required at least nine.

### Fix

Correct parser validation to the protocol actually emitted by TX.

## QR larger than viewport

### Symptom

The QR code was clipped and the phone could not reliably decode it.

### Fix

Use `100dvh`, `min-height:0`, bounded grid panels, and QR `max-width/max-height` rules. The whole transmitter interaction must fit one screen.

## iPhone camera could not reach 120/240 fps in browser

### Observation

Browser camera capability exposed a maximum near 60 fps even though native iPhone camera modes can support higher slow-motion capture rates.

### Lesson

Browser `getUserMedia()` capability is not equivalent to native camera hardware capability. Web benchmark results must be labeled accordingly.

## Vercel edge cache / stale root path

### Symptom

Changing query parameters did not always guarantee that the newest root HTML was observed immediately.

### Mitigation

V0.20.8 introduced versioned asset paths such as a dedicated versioned HTML/JS name rather than relying only on `/?v=...` cache busting.

## Benchmark-design incident: scheduled maintenance

### Symptom

Camera resets intended to improve stability lowered wall-clock throughput.

### Evidence

V0.18 Maintenance A/B ≈ **0.77×**.

### Fix

Move to continuous receiver and escalate recovery only when actual loss of lock requires it.
