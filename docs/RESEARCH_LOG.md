# Research Log

This file records the evolution of Optical Link Bench as an experiment, including failed assumptions and benchmark-design changes.

## Problem statement

The research began by asking whether a computer display and a phone camera can form a practical high-throughput optical channel using rapidly changing QR codes. The initial intuition was that display refresh rate and camera FPS would dominate. Experiments progressively showed that browser camera exposure, decoding cadence, ROI quality, benchmark drift, and long-duration stability matter at least as much.

## V0.8 — autonomous benchmark runner

- Moved away from manual file upload and toward synthetic payloads so the benchmark could run itself.
- TX generated QR frames automatically; RX measured unique frames and throughput.
- UI was constrained to a single screen so the QR itself and controls remained visible.
- Early tests exposed that a benchmark can appear fast while the receiver is actually missing a large fraction of transmitted frames.

## V0.8.2 — viewport / QR visibility fixes

- QR rendering was resized to fit the available desktop viewport.
- Removed the need to scroll the transmitter page.
- Continued work on automatic test sequencing.

## V0.9.x — operational reliability

Intermediate V0.9 revisions focused on making the benchmark runnable at all:

- progress indication
- start-button event handling
- receiver synchronization
- camera startup and permission handling on iPhone
- avoiding all-white/blank-page failures

Not every V0.9 subrevision is preserved as a source snapshot. The engineering incidents are summarized in `INCIDENTS.md`.

## V0.10 — extreme-value search

Goal: search payload / hold / QR-rate combinations more aggressively.

Key result:

- best reported stable candidate: **500 B, Hold 3, 20 QR/s → 8.50 KB/s, 85.0% efficiency**
- severe control drift was observed, so the ranking could not be treated as stationary.

Decision: parameter search alone was insufficient; controls had to be interleaved.

## V0.11 — repeatable peak

Goal: require candidate repetition instead of selecting one attractive trial.

Key result:

- **700 B, H3, 20 QR/s → median 13.77 KB/s**
- range: **12.83–14.00 KB/s**
- CV: **4.6%**
- median efficiency: **98.3%**
- ROI decode median shown around **16 ms**

However, control drift still existed: **10.80 → 8.60 KB/s**.

Decision: repeatability was necessary but still not enough if the receiver state changed over time.

## V0.12 — local peak search

Goal: search locally around strong V0.11 candidates.

Key result:

- repeatable median: **900 B, 18/s → 13.39 KB/s**
- range: **10.80–15.75 KB/s**
- CV: **18.6%**
- median efficiency: **81.1%**

Control behavior deteriorated strongly during the run.

Decision: candidate ranking was contaminated by time-dependent receiver drift.

## V0.13 — drift-normalized benchmark

Goal: normalize each candidate against nearby control measurements.

Reported:

- raw peak: **9.83 KB/s** at 850 B × 18/s
- drift-normalized peak: **8.32 KB/s** at 900 B × 19/s
- no candidate passed the sustained-validation threshold

Decision: the raw headline number was not the main result; the inability to validate sustained performance was more informative.

## V0.14 — paired benchmark

Goal: pair each candidate with an anchor/control to reduce time-order bias.

Reported:

- raw peak: **7.42 KB/s**
- anchor baseline: **7.39 KB/s** over 65 anchor trials
- best candidate / anchor ratio: **1.385×**, but relative CV was **45.7%**
- no candidate passed the full sustained criteria

Decision: short paired wins were still too unstable to support a claimed operating point.

## V0.15.1 — one-shot full auto benchmark

Goal: perform broad scan, repetition, sustained, endurance, and health checks in one automatic run.

Reported:

- broad raw peak: **20.15 KB/s** at 800 B × 30/s, 85.2% efficiency
- 15 s sustained peak: **8.27 KB/s** at 900 B × 14/s
- 30 s endurance peak: **10.00 KB/s** at 850 B × 14/s, 84.0% efficiency
- validated sustained candidate: **10.00 KB/s** at 850 B × 14/s for 30 s
- health baseline: **5.96 KB/s**, first→last drift 10.6%

This was the strongest validated short-duration result at that stage.

## V0.16 — exhaustive one-shot

Goal: broaden the one-shot matrix and increase endurance rigor.

Reported:

- broad raw peak: **13.42 KB/s** at 1200 B × 12/s
- repeatable: **7.38 KB/s** at 1000 B × 8/s, CV 11.8%, efficiency 92.3%
- 15 s sustained: **4.59 KB/s**
- 45 s endurance: **5.49 KB/s**
- health drift: **59.5%**
- no fully validated endurance candidate

Decision: exhaustive scans themselves appeared to change receiver state. More testing was not automatically better testing.

## V0.17 — convergent one-shot

Goal: reduce low-information trials and spend more time on repetition/endurance.

Reported:

- burst peak: **9.60 KB/s** at 1200 B × 20/s
- repeatable 5 s: **5.28 KB/s** at 1100 B × 8/s
- no candidate passed the 30 s or 90 s thresholds
- recovery: **90.9%**
- health drift: **59.5%**

A particularly important observation was that **1000 B × 8/s reached 8.00 KB/s at 100% efficiency in a short window**, while higher QR rates often wasted most transmitted frames.

Decision: stop spending most of the experiment on parameter search; isolate the source of long-run drift.

## V0.18 — stability fix / maintenance A-B

Goal: test whether resets and camera maintenance improve long-duration goodput.

Reported:

- validated sustained: **7.86 KB/s at 1000 B × 8/s**, 99.0% active efficiency
- maintenance A/B ratio: **0.77×**
- decay example: **-15.6% → -27.3%**
- ROI median decode time: **34.0 ms**
- camera: **720×1280 @ 30 fps**

Interpretation: scheduled maintenance / camera restart cost more wall-clock throughput than it recovered.

Decision: camera restart should become a last-resort fault-recovery action, not scheduled maintenance.

## V0.19 — continuous receiver

Goal: run a single operating point for 10 minutes with no scheduled camera restart.

Fixed TX:

- payload: **1000 B**
- rate: **8 QR/s**
- theoretical payload rate: **8.00 KB/s**

Result:

- wall goodput: **5.58 KB/s**
- active goodput: **5.58 KB/s**
- efficiency: **69.8%** (3351 / 4801 unique frames)
- availability: **100.0%**
- hard camera downtime: **0.0 s**
- 10 s CV: **20.9%**
- decay: **+13.5%**
- recovery ladder: **L1=5, L2=1, L3=0**
- full reacquire: **5**

Interpretation: the receiver stayed available and did not thermally collapse in a simple monotonic way. The main loss was now **missed QR frames while the camera remained available**.

Decision: isolate decoder sampling rate.

## V0.20 — decoder sampling experiment

The TX operating point remains fixed at 1000 B × 8 QR/s. The experiment varies only receiver decode cadence:

1. 60 s warm-up
2. 12 Hz × 90 s
3. 18 Hz × 90 s
4. 24 Hz × 90 s
5. camera-driven × 90 s
6. camera-driven × 300 s endurance

Primary question:

> Is the V0.19 69.8% efficiency mainly caused by insufficient decode opportunities per displayed QR?

## V0.20.1–V0.20.8 — benchmark infrastructure hardening

Before a clean V0.20 run could be trusted, multiple infrastructure failures had to be removed:

- packet-field count validation corrected
- initialization syntax error fixed
- single-screen compact layout restored
- Production HTML stopped depending on protected Preview JS assets
- external jsDelivr / unpkg dependency removed from runtime
- qrcode + jsQR bundled locally
- false `window.QRCode/window.jsQR` readiness gate removed
- versioned asset paths introduced to avoid stale root-path edge cache

Current Production generation: **V0.20.8**.

A clean complete V0.20.8 sampling benchmark is still pending.
