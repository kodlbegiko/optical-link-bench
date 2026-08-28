# Optical Link HS — Proposed Protocol Architecture

Status: **design proposal / not yet a performance claim**.

This document defines a conservative first architecture for a high-speed display-to-camera optical link. The first implementation should be binary and observable. Multilevel color or OFDM-like approaches should come only after the binary channel is characterized.

---

## 1. Design goals

### Required

- one-way payload path is sufficient;
- sender requires only a display;
- receiver requires only a camera;
- no shared network;
- no account/pairing;
- arbitrary file bytes;
- resilient to dropped visual frames;
- final cryptographic integrity check;
- explicit protocol versioning;
- graceful fallback to QR mode;
- measurable channel state.

### Non-goals for V1

- printed/static readability;
- default Camera-app decoding;
- maximum possible spectral efficiency;
- color modulation;
- rolling-shutter exploitation;
- native-only features.

---

## 2. Bootstrap

A normal QR code should bootstrap the session.

Conceptual bootstrap payload:

```text
magic: OLHS
protocol: 1
session: <random id>
mode: binary-grid
file_size: <bytes>
file_name: <safe display name>
file_sha256: <digest>
block_size: <bytes>
fec: <scheme/version>
```

The actual serialization can later use compact binary/CBOR/base-N encoding. Human-readable form is preferred during early debugging.

The bootstrap QR may also open the receiver website when needed.

---

## 3. Persistent visual geometry

V1 should keep the outer geometry stable for the session.

```text
TL marker                                    TR marker
     ■────────────────────────────────────■
     │                                    │
     │        dynamic payload field       │
     │                                    │
     │ pilot                         pilot│
     ■────────────────────────────────────■
BL marker                                    BR marker
```

### Why persistent geometry

A QR decoder repeatedly spends work discovering the symbol. A continuous optical session can amortize geometry acquisition across many payload frames.

Receiver lifecycle:

1. full-frame marker search;
2. estimate homography;
3. warp to normalized plane;
4. lock ROI;
5. track marker drift cheaply;
6. trigger full reacquire only when confidence falls.

---

## 4. Binary grid V1

The payload field is divided into an N×M logical cell grid.

Each cell carries one binary symbol:

```text
black = 0
white = 1
```

The exact polarity should not be assumed blindly. Reference cells can provide black/white levels for each run.

### Initial grid sweep

Candidate dimensions should be tested, not guessed:

```text
32×32
48×48
64×64
80×80
96×96
128×128
```

The useful metric is not raw bits/frame. It is verified goodput after optical errors and FEC.

---

## 5. Frame structure

Conceptual V1 logical frame:

```text
[ fixed geometry / reference ]
[ sync / phase ]
[ protocol flags ]
[ block identity ]
[ payload / FEC symbols ]
[ lightweight frame check ]
```

Do not spend excessive cells on sequence numbers if the FEC layer can tolerate erasures and unordered block arrival.

---

## 6. Temporal synchronization

A major problem in dynamic visual links is that display transitions and camera exposures are not synchronized.

V1 needs a visible pilot that lets the receiver estimate frame phase.

Possible pilot evolution:

### V1 — binary toggle

```text
A: 01
B: 10
```

Simple but weak against missed frames.

### V1.1 — Gray-coded phase

```text
00 → 01 → 11 → 10
```

Single-bit transitions reduce ambiguity.

### Later — richer training sequence

Use a known temporal sequence to estimate:

- display/camera phase;
- exposure integration behavior;
- frame tearing;
- rolling-shutter direction/rate.

---

## 7. Display scheduling

Requested JavaScript timer rate is not the physical signal.

The TX subsystem must record actual presentation behavior.

Preferred experiment ladder:

1. current timer baseline;
2. `requestAnimationFrame()` aligned updates;
3. integer display-frame hold periods;
4. measured presentation interval distribution.

Example for a 60 Hz display:

```text
10 symbols/s → 6 display refreshes/symbol
7.5 symbols/s → 8 refreshes/symbol
```

Integer holds may be more reliable than an arbitrary target such as 8/s, but this must be measured.

---

## 8. Receiver pipeline

Target architecture:

```text
Camera frame
    │
    ▼
Frame timestamp / validity
    │
    ▼
ROI / marker tracking
    │
    ▼
Perspective warp
    │
    ▼
Reference-level normalization
    │
    ▼
Grid sampling
    │
    ▼
Bit confidence map
    │
    ▼
Frame/block parser
    │
    ▼
FEC / reconstruction
```

### Important distinction

The receiver should produce not just hard bits but confidence where practical. Low-confidence cells may be more useful as erasures than as confident wrong bits.

---

## 9. FEC strategy

Dynamic optical channels naturally lose frames. The application should not require every frame to arrive.

### Early implementation

A simple block erasure code can validate the plumbing.

### Practical target

A fountain/Raptor-style approach is attractive because:

- frame order does not need to be perfect;
- duplicates are tolerable;
- sender can continue producing repair symbols;
- completion happens when enough independent symbols arrive.

The FEC layer must be separately benchmarked so CPU cost does not get confused with optical throughput.

---

## 10. Integrity hierarchy

Use multiple levels for different purposes.

### Frame/block check

Fast corruption rejection such as CRC.

### File-level check

Cryptographic digest, initially SHA-256.

### Completion rule

```text
reconstructed size correct
AND
SHA-256 matches
```

No UI success state before both pass.

---

## 11. Rate adaptation

The long-term differentiator should be automatic optical rate control.

Inputs can include:

- camera FPS;
- valid-frame ratio;
- grid cell confidence;
- frame erasure rate;
- decode processing time;
- ROI stability;
- recent useful goodput;
- recent FEC overhead.

Controls can include:

- symbol/frame rate;
- grid dimensions;
- cell size;
- guard/reference area;
- payload/FEC ratio;
- later, modulation order.

### Conservative controller

```text
channel healthy for sustained window
        → increase one step

loss/confidence crosses threshold
        → decrease one step
```

Avoid rapidly oscillating adaptation. Use hysteresis and minimum dwell durations.

---

## 12. Recovery ladder

The receiver should prefer low-cost recovery.

```text
L0 normal tracking
 ↓
L1 expand ROI / marker refresh
 ↓
L2 full-frame geometry reacquire
 ↓
L3 decoder/canvas/worker reset
 ↓
L4 camera restart only if camera pipeline is actually unhealthy
```

Historical QR work showed that scheduled camera restarts can reduce wall goodput, so restarts should remain fault-triggered.

---

## 13. Browser implementation plan

### Main thread

- UI;
- camera element lifecycle;
- high-level state;
- report rendering.

### Worker

Prefer moving CPU-heavy decode/sampling work off the main thread where WebKit support permits it.

Candidate components:

- normalized frame sampling;
- cell classification;
- CRC/block parsing;
- FEC calculations later.

Do not introduce workers before metrics can prove whether the main thread is a bottleneck.

---

## 14. Codec comparison contract

Every codec plug-in should expose equivalent conceptual operations:

```text
configure(profile)
renderFrame(symbols)
acquire(frame)
decode(frame)
getDiagnostics()
```

A benchmark must be able to run QR and Optical Grid with the same Experiment Engine.

---

## 15. V1 experiment matrix

### A. Geometry

- marker designs;
- padding;
- perspective angle;
- distance;
- motion tolerance.

### B. Spatial density

- grid sizes;
- QR-like module sizes;
- sample confidence;
- decode CPU time.

### C. Temporal rate

- 5/10/15/20/30 presentation changes per second where physically meaningful;
- integer display-frame holds;
- camera-delivered FPS.

### D. FEC

- no FEC baseline;
- fixed parity baseline;
- fountain/Raptor-style candidate.

### E. End-to-end

- 100 KB;
- 1 MB;
- 10 MB files;
- hash verified;
- repeated trials.

---

## 16. Invalid-result conditions

A run must be flagged or invalidated if:

- browser page becomes hidden;
- orientation changes unexpectedly;
- camera track restarts without being recorded;
- display sleeps/dims materially;
- version mismatch occurs;
- raw telemetry is incomplete;
- final file hash fails;
- benchmark timing boundaries cannot be reconstructed.

---

## 17. Later extensions

Only after binary V1 is characterized:

### Multilevel grayscale

More bits/cell but requires robust photometric calibration.

### Color modulation

Higher density but sensitive to display profile, white balance, ISP and ambient lighting.

### OFDM/frequency-domain coding

Potentially powerful for screen-camera channels, but more complex synchronization and demodulation.

### Native receiver

AVFoundation/native image pipeline can isolate WebKit limitations and offer tighter exposure/focus/FPS control.

### Rolling-shutter-aware mode

Instead of treating rolling shutter only as distortion, encode temporal information that can be observed within one sensor frame.

These are research branches, not prerequisites for a useful V1.
