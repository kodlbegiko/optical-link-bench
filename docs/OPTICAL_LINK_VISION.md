# Optical Link — Product Vision and Research Architecture

## 1. Mission

Optical Link explores a narrow but technically interesting question:

> **How useful can data transfer become when the only connection between two devices is light from one screen into another device's camera?**

The final goal is not to “replace QR Code everywhere.” QR has advantages that a custom dynamic optical protocol cannot reproduce: universal camera recognition, static printing, mature standards and enormous ecosystem support.

The goal is instead to build a **functional superset for device-to-device screen-camera transfer**:

- retain standard QR for discovery, small payloads and universal bootstrap;
- retain animated QR as a transparent baseline;
- introduce a high-speed optical payload mode for larger files;
- switch modes automatically based on payload, channel conditions and receiver capability.

The system should feel as simple as scanning a QR code while internally behaving more like a modem.

---

## 2. Non-negotiable user advantages

The high-speed mode is only worth building if it preserves the practical reasons optical transfer is interesting.

### Required

1. **No Internet required.**
2. **No Wi-Fi or Bluetooth pairing.**
3. **No account or identity exchange.**
4. **No cloud upload.**
5. **Air-gap compatible.** Sender and receiver do not need a shared network.
6. **One-way capable.** A receive path must not be mandatory for the sender.
7. **Display-only sender.** Ordinary screen hardware should be enough.
8. **Camera-only receiver.** Ordinary camera hardware should be enough.
9. **Arbitrary files.** Not just URLs/text.
10. **Integrity verified.** Completion means reconstructed bytes match the original file hash.
11. **Browser first.** Web should remain the compatibility path wherever browser APIs permit useful performance.
12. **Open benchmark.** Performance claims must be reproducible.

### Explicitly not required

- replacing printed/static QR codes;
- being readable by the default Camera app after entering high-speed mode;
- beating Wi-Fi Direct, USB or AirDrop in absolute throughput;
- guaranteeing the same bitrate on every camera/display combination.

---

## 3. Product model: Hybrid Optical Link

```text
                     User selects payload
                            │
                            ▼
                    Capability decision
                            │
           ┌────────────────┼─────────────────┐
           │                │                 │
      tiny/static       animated QR       large payload
           │                │                 │
           ▼                ▼                 ▼
     Standard QR       QR Stream       Optical Link HS
           │                │                 │
           └──────────── same UX ─────────────┘
```

The user should not need to understand codec details.

Possible future automatic policy:

```text
small payload       → static QR
small file          → QR stream
large file          → Optical HS
weak channel        → reduce grid/rate/modulation
strong channel      → increase payload density
```

Thresholds must come from measurements rather than hard-coded assumptions.

---

## 4. Why a custom high-speed mode can beat QR in this scenario

QR is designed so an arbitrary static frame can be independently discovered and decoded. That requires repeated structure per frame: finder patterns, timing/alignment structures, format/version information, masking and QR-level ECC.

In a continuous transfer, the receiver often already knows:

- where the display is;
- the perspective transform;
- the grid dimensions;
- the protocol version;
- the current session;
- approximate frame timing.

A specialized dynamic protocol can amortize those costs across the session.

Instead of rediscovering a complete QR symbol every frame, Optical HS can keep persistent fiducials on screen and devote most changing pixels to payload.

---

## 5. Proposed physical frame

V1 should deliberately remain simple and binary.

```text
┌─────────────────────────────────────────────┐
│  ■                                         ■│
│                                             │
│      ┌───────────────────────────────┐      │
│      │                               │      │
│      │        BINARY DATA GRID       │      │
│      │                               │      │
│      └───────────────────────────────┘      │
│                                             │
│  ■      PILOT / FRAME PHASE / SYNC         ■│
└─────────────────────────────────────────────┘
```

### Persistent regions

- corner fiducials / locator markers;
- optional border/reference levels;
- temporal pilot / frame phase field;
- small control region when necessary.

### Dynamic region

- payload symbols;
- FEC symbols;
- block/session sequence information where needed.

The first implementation should prefer robustness and observability over maximum density.

---

## 6. Session lifecycle

```text
DISCOVERY
   │ Standard QR
   ▼
BOOTSTRAP
   │ protocol + session + file metadata
   ▼
ACQUIRE
   │ find persistent markers
   ▼
CALIBRATE
   │ homography / brightness / timing
   ▼
TRAIN
   │ estimate channel quality
   ▼
TRANSFER
   │ payload + FEC
   ├── rate adaptation
   ├── ROI tracking
   └── telemetry
   ▼
DECODE / RECONSTRUCT
   ▼
HASH VERIFY
   │
   ├── PASS → COMPLETE
   └── FAIL → explicit failure / recovery
```

The protocol must never report completion before integrity verification.

---

## 7. Three-engine architecture

Long term, code should be separated into three independently replaceable engines.

### 7.1 Experiment Engine

Responsibilities:

- experiment manifests;
- phase state machine;
- counterbalancing/randomization;
- controls and anchors;
- run IDs;
- telemetry collection;
- validity gates;
- statistics;
- report/export.

The experiment engine must not care whether the codec is QR, binary grid or OFDM.

### 7.2 Optical Engine

Responsibilities:

- transmitter frame clock;
- symbol rendering;
- camera acquisition;
- ROI tracking;
- perspective correction;
- sampling;
- decoder workers;
- channel estimation;
- optical synchronization.

### 7.3 Protocol Engine

Responsibilities:

- bootstrap metadata;
- packets/blocks;
- sequence identity;
- CRC/checksums;
- FEC/fountain/Raptor-style recovery;
- file reconstruction;
- final hash verification.

This separation prevents a new visual codec from forcing a rewrite of experiment methodology or file reconstruction logic.

---

## 8. Recommended source architecture

```text
src/
├── app/
│   ├── main.js
│   ├── router.js
│   └── state.js
├── experiment/
│   ├── runner.js
│   ├── state-machine.js
│   ├── manifest.js
│   ├── randomizer.js
│   └── validation.js
├── protocol/
│   ├── bootstrap.js
│   ├── packet.js
│   ├── crc32.js
│   ├── fec.js
│   ├── file-manifest.js
│   └── integrity.js
├── tx/
│   ├── transmitter.js
│   ├── frame-clock.js
│   ├── scheduler.js
│   └── metrics.js
├── rx/
│   ├── camera.js
│   ├── receiver.js
│   ├── roi-tracker.js
│   ├── sampler.js
│   ├── recovery.js
│   └── metrics.js
├── codecs/
│   ├── qr/
│   ├── optical-grid/
│   ├── multilevel-grid/
│   └── ofdm/
├── telemetry/
│   ├── event-log.js
│   ├── timestamps.js
│   └── environment.js
├── export/
│   ├── json.js
│   ├── csv.js
│   └── report.js
└── workers/
    └── decoder-worker.js
```

Do not perform this refactor merely for aesthetics. Move modules as each subsystem becomes independently testable.

---

## 9. Measurement model

Every performance claim should be reconstructable from raw events.

### Level 1 — Run metadata

- run ID;
- experiment version;
- codec version;
- timestamp;
- display viewport/resolution/refresh information when available;
- browser/OS/user agent;
- camera track settings;
- payload configuration;
- physical notes supplied by tester.

### Level 2 — Raw events

Examples:

```text
TX_FRAME_REQUESTED
TX_FRAME_PRESENTED
CAMERA_FRAME
DECODE_START
DECODE_END
DECODE_OK
DECODE_FAIL
ROI_ACQUIRE
ROI_LOST
ROI_REACQUIRE
MODE_CHANGE
VISIBILITY_CHANGE
RUN_INVALIDATED
```

### Level 3 — Derived metrics

- requested TX rate;
- actual TX presentation rate;
- presentation interval p50/p95/p99;
- camera presented FPS;
- decoder attempts/s;
- decoder success rate;
- unique payload blocks/s;
- duplicates/s;
- erasure rate;
- goodput;
- useful-file goodput;
- short-window CV;
- startup convergence;
- drift;
- ROI/full-frame latency distributions;
- final integrity result.

---

## 10. The KPI hierarchy

### KPI 1 — Integrity

```text
SHA-256(original) == SHA-256(reconstructed)
```

If false, throughput is irrelevant.

### KPI 2 — File completion rate

A practical system should converge toward ≥99% successful complete transfers under its declared operating envelope.

### KPI 3 — Useful wall-clock goodput

```text
original file bytes successfully reconstructed
──────────────────────────────────────────────
wall-clock time from transfer start to verify
```

This is the primary product KPI.

### KPI 4 — Stability

Throughput must survive duration and repetition.

### KPI 5 — Peak

Peak is useful for exploration only. It is never the headline product performance number.

---

## 11. Performance gates

Targets below are research gates, not promises.

### Gate A — trustworthy baseline

- fix metric correctness issues;
- export raw telemetry;
- record actual TX timing;
- run counterbalanced QR experiments;
- reproduce results across independent runs.

### Gate B — Optical Grid proof

- real file reconstruction;
- binary grid;
- persistent locators;
- FEC;
- hash verification;
- ≥50 KB/s useful goodput in a controlled matched test.

### Gate C — competitive mode

- ≥200 KB/s sustained useful goodput;
- no manual reset during a run;
- robust enough for ordinary handheld setup or a clearly declared fixed setup.

### Gate D — QR-frontier challenge

- ≥300 KB/s useful goodput;
- real multi-megabyte file;
- repeated success;
- same-device matched QR comparison;
- integrity pass.

### Gate E — stretch / moonshot

- ≥500 KB/s stretch;
- 1 MB/s only if measurements show sufficient camera/display/browser headroom.

---

## 12. What “better than QR” means

Optical HS should never claim to be globally better than QR Code.

A legitimate claim would be narrower:

> Under matched screen-to-camera file-transfer conditions, Optical HS preserves the zero-network/zero-pairing workflow while delivering higher sustained useful file goodput than the QR baseline.

Required comparison controls:

- same sender display;
- same receiver device;
- same browser/native class;
- same distance and approximate angle;
- same lighting;
- same file;
- same run-duration class;
- same integrity requirement;
- repeated trials;
- raw data retained.

---

## 13. Future modulation ladder

Do not jump directly to the most complex technique.

```text
Standard QR baseline
       ↓
Binary fixed grid
       ↓
Adaptive grid density
       ↓
Temporal pilots / stronger sync
       ↓
Multilevel grayscale
       ↓
Color / channel calibration
       ↓
Frequency-domain / OFDM-like coding
       ↓
Native camera pipeline
       ↓
Rolling-shutter-aware modulation
```

Every layer must justify itself by measured useful goodput or robustness.

---

## 14. Browser and native strategy

### Browser

Purpose:

- compatibility;
- zero-install receiver;
- easy sharing;
- transparent benchmark reproduction.

Browser performance should be treated as a platform result, not a hardware ceiling.

### Native

Purpose later:

- precise camera timestamps;
- exposure/focus control;
- high-FPS modes;
- native pixel access;
- SIMD/GPU processing;
- browser-vs-hardware isolation.

A native implementation should be introduced as a comparison track, not used to hide browser limitations.

---

## 15. Product success definition

The project is successful if a user can:

```text
Sender: choose a file → show
Receiver: open/scan → point camera → receive → verified
```

while the system automatically chooses a suitable optical mode and does not require networking or pairing.

The research is successful if every major throughput claim can be traced back to a reproducible run with raw telemetry and integrity evidence.
