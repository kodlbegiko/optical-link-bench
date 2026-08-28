# Optical Link Roadmap V2

This roadmap is organized by **research question**, not by arbitrary feature count. A stage advances only when its evidence gate is met.

---

## Phase 0 — Preserve the baseline

### Goal

Keep the current V0.20.8 QR benchmark operational while the project expands.

### Deliverables

- keep current source and historical archive;
- expose the benchmark from a stable route;
- preserve V0.10–V0.19 evidence;
- avoid rewriting historical values as new conclusions.

### Exit gate

Existing benchmark remains independently accessible after the new project website is deployed.

---

## Phase 1 — Measurement Integrity (V0.20.x)

### Research question

Can the benchmark produce data trustworthy enough to compare decoder schedules and future codecs?

### P0 fixes

1. **10-second CV zero-window correctness**
   - construct the complete time-window sequence;
   - explicitly insert zero-throughput windows;
   - never compute stability only from windows with successful decodes.

2. **Phase boundary accounting**
   - SUMMARY/INTERMISSION must not add decoder attempts to the previous scored phase;
   - each event receives an explicit phase ID.

3. **Actual TX timestamps**
   - record requested and actual frame presentation times;
   - derive interval p50/p95/p99;
   - expose missed/late presentation intervals.

4. **Camera timestamps**
   - record `requestVideoFrameCallback` metadata where available;
   - distinguish callback rate from unique media-frame delivery.

5. **Run ID + environment metadata**
   - benchmark version;
   - browser/OS;
   - camera track settings;
   - viewport;
   - visibility/orientation events.

6. **Raw JSON export**
   - event stream;
   - phase summaries;
   - environment;
   - validity status.

7. **Metric tests**
   - CV with zero windows;
   - phase boundary tests;
   - duplicate accounting;
   - sequence wrap/parse tests;
   - summary denominator tests.

### Exit gate

Given an exported run, headline metrics can be recomputed without the live UI.

---

## Phase 2 — Decoder Sampling Causality (V0.21)

### Research question

How much of V0.19's ~30% missing theoretical payload is caused by decoder sampling cadence?

### Experiment design

TX remains fixed at the diagnostic point.

Compare:

- 12 Hz;
- 18 Hz;
- 24 Hz;
- camera-driven.

### Required methodological upgrade

Use counterbalanced ordering rather than a fixed ascending sequence.

Minimum practical plan:

```text
Run A: 12 → 18 → 24 → MAX
Run B: MAX → 24 → 18 → 12
Run C/D: additional balanced orders
```

Better: Latin-square ordering across repeated runs.

### Measurements

- useful/unique goodput;
- efficiency;
- actual attempts/s;
- camera frames/s;
- ROI/full decode latency;
- 10s CV including zero windows;
- startup convergence;
- time drift;
- raw event log.

### Exit gate

Either:

A. a higher sampling strategy materially and repeatedly improves unique-frame recovery; or

B. sampling is rejected as the dominant explanation and the next bottleneck is selected from evidence.

---

## Phase 3 — Display Timing (V0.22)

### Research question

Is transmitter presentation jitter/tearing limiting decodability?

### Compare

- timer-based schedule;
- `requestAnimationFrame` schedule;
- integer display-refresh hold counts;
- guard frames if necessary.

### Key metrics

- actual presentation interval distribution;
- decode success by relative presentation phase;
- missed-frame clusters;
- useful goodput;
- stability.

### Exit gate

Choose a transmitter clock policy based on measured end-to-end goodput, not requested QR/s.

---

## Phase 4 — Browser QR Ceiling (V0.23–0.25)

### Research question

What is the strongest defensible QR baseline on the current browser/device path?

### Search strategy

Do not return to exhaustive one-shot sweeps that heat and drift the device.

Use:

```text
coarse search
→ local refinement
→ repeated validation
→ endurance
```

### Candidate variables

- QR payload bytes;
- QR rate;
- QR dimensions;
- decoder implementation;
- ROI strategy;
- worker/main-thread processing;
- camera constraints.

### Deliverable

A QR baseline profile that future Optical HS must beat under matched conditions.

---

## Phase 5 — Real File QR Transfer

### Research question

Can the benchmark metrics translate into reliable real-file transfer?

### Add

- file manifest;
- chunk/block layer;
- FEC/fountain recovery;
- file reconstruction;
- SHA-256 verification;
- useful wall-clock goodput.

### Exit gate

Repeated 1 MB and 10 MB file transfers complete with valid hashes.

---

## Phase 6 — Optical Grid V0 (first custom codec)

### Research question

Can a persistent-locator binary grid outperform QR while preserving the same optical workflow?

### Minimum implementation

- standard QR bootstrap;
- persistent corner markers;
- fixed binary payload grid;
- perspective correction;
- temporal pilot;
- CRC/block identity;
- simple erasure recovery;
- final SHA-256.

### First target

**≥50 KB/s verified useful goodput** under a controlled same-device comparison.

### Important rule

Do not add color or multilevel modulation yet.

---

## Phase 7 — Optical Rate Control

### Research question

Can the system adapt automatically to device/channel quality instead of requiring manual tuning?

### Inputs

- camera FPS;
- processing latency;
- cell confidence;
- frame erasure rate;
- ROI confidence;
- FEC overhead;
- recent useful goodput.

### Controls

- grid size;
- presentation rate;
- payload/FEC ratio;
- guard region;
- later modulation order.

### Exit gate

The controller converges toward a stable operating point and does not oscillate aggressively.

---

## Phase 8 — Competitive High-Speed Mode

### Target ladder

- **≥100 KB/s** verified;
- **≥200 KB/s sustained** competitive range;
- **≥300 KB/s sustained useful goodput** QR-frontier challenge;
- **≥500 KB/s** stretch.

Each milestone requires:

- real file;
- final hash pass;
- repeated trials;
- no manual reset during scored transfer;
- matched baseline comparison.

---

## Phase 9 — Higher-order modulation research

Only after binary Optical Grid has a known ceiling.

### Branches

1. adaptive spatial density;
2. multilevel grayscale;
3. calibrated color symbols;
4. frequency-domain / OFDM-like coding;
5. multiple spatial regions / visual MIMO.

Each branch must have an ablation against binary Grid.

---

## Phase 10 — Native receiver track

### Purpose

Separate browser limits from camera/hardware limits.

### Native capabilities

- camera timestamp control;
- focus/exposure lock;
- high-FPS modes;
- direct pixel buffers;
- SIMD/GPU processing;
- more deterministic acquisition.

### Comparison

```text
same display + codec
Web receiver
vs
Native receiver
```

Do not compare different codecs and different receiver stacks simultaneously when diagnosing a bottleneck.

---

## Phase 11 — Rolling-shutter-aware optical mode

Research whether temporal information can deliberately use sensor row timing rather than only fighting rolling-shutter artifacts.

This phase is high-risk/high-upside and should not block practical browser work.

---

## V1.0 definition

V1.0 is **not** “the fastest version.”

V1.0 should mean a stable open Optical Link specification with:

- reproducible benchmark harness;
- QR bootstrap and baseline;
- real file transfer;
- high-speed codec plug-in architecture;
- FEC;
- integrity verification;
- JSON/CSV evidence export;
- automatic channel/profile selection;
- documented browser operating envelope;
- cross-device comparison methodology.

---

## Decision rules

### If efficiency is low

```text
Are camera frames actually arriving?
├─ no → camera/browser acquisition
└─ yes
   Are decode opportunities sufficient?
   ├─ no → scheduler/CPU
   └─ yes
      Is optical symbol confidence low?
      ├─ yes → display/camera/geometry/timing
      └─ no → protocol/accounting
```

### If efficiency is high

Increase channel load one dimension at a time.

### If peak improves but useful goodput does not

Reject the optimization.

### If an optimization works only in one order/time position

Treat it as drift-contaminated until counterbalanced evidence exists.
