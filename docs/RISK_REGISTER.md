# Optical Link Risk Register

This document lists expected failure modes, how they would mislead the project, how to detect them, and the preferred mitigation.

| Risk | Failure mode / misleading conclusion | Detection | Primary mitigation |
|---|---|---|---|
| Receiver state drift | Later/earlier modes look better because of time, not treatment | interleaved controls, counterbalanced order | Latin-square/counterbalanced experiments |
| Thermal/runtime drift | exhaustive searches select candidates under different device states | control decay, latency drift, long-run telemetry | warm-up, shorter blocks, repeated independent runs |
| TX timer jitter | requested QR/s differs from physical presentation | actual presentation timestamps | rAF/integer display-frame scheduling |
| Display transition tearing | camera sees mixed old/new visual frame | failure clusters around transitions, image diagnostics | longer hold, synchronized switching, temporal pilot |
| Rolling shutter | spatial bands contain different temporal states | row-dependent errors | guard timing; later rolling-shutter-aware codec |
| Camera auto exposure | contrast changes without software request | luminance/reference-cell drift | reference levels; native exposure lock later |
| Autofocus/lens switching | sudden blur/FOV changes | focus/geometry confidence changes | larger cells, stable distance, native focus control later |
| ROI drift | fast decode gradually crops wrong region | marker confidence / edge proximity | marker tracking + low-cost reacquire |
| Full-frame fallback cost | fallback consumes enough CPU to reduce future attempts | decode latency + fallback rate | adaptive ROI, limit fallbacks, worker path |
| Main-thread blocking | decode/UI blocks frame scheduling | long tasks / attempts below camera FPS | worker/off-main-thread processing if proven |
| GC/JIT stalls | sporadic zero-throughput windows | event timing gaps | warm-up, allocation reduction, raw timestamps |
| Browser tab hidden | timers/camera callbacks throttled | Page Visibility API | invalidate/pause run |
| Orientation/viewport change | homography/grid becomes invalid | resize/orientation event | reacquire or invalidate scored phase |
| Screen dimming/lock | optical SNR changes during run | brightness event often unavailable; visual reference drift | keep-awake guidance, reference cells, validity note |
| Version/cache mismatch | TX/RX parse different protocol | version/magic handshake | versioned assets and protocol IDs |
| False decode | corrupted payload counted as valid | CRC/hash failure | CRC per block + final SHA-256 |
| Duplicate frames | decode rate inflated relative to useful data | sequence/block identity | unique-block accounting |
| Missing-frame CV bug | stability looks good because zero windows disappear | synthetic tests | generate complete window series with explicit zeros |
| Phase leakage | intermission attempts counted in scored mode | event phase IDs | explicit state machine / phase boundaries |
| FEC hides optical weakness | file succeeds but optical decoder is inefficient | report raw erasure + FEC overhead separately | separate channel and application metrics |
| FEC CPU becomes bottleneck | optical mode seems capped by reconstruction | CPU timing / queue | profile FEC independently / worker/native optimization |
| Grid too dense | raw bits/frame rise while error rate explodes | cell confidence, useful goodput | adaptive/coarse-to-fine density search |
| Binary threshold drift | black/white classification fails under lighting changes | reference-cell distribution | per-frame/local normalization |
| Color cross-talk | higher modulation order produces systematic symbol errors | confusion matrix by color | calibration, lower order, grayscale fallback |
| Device overfitting | excellent on one iPhone/display but poor elsewhere | cross-device matrix | standardized profiles + capability adaptation |
| Browser overfitting | Safari-specific optimization harms Chrome or vice versa | browser matrix | compatibility profile and native track separation |
| Benchmark overfitting | algorithm optimizes synthetic payload rather than files | real-file verification | file-transfer milestone gates |
| Peak chasing | marketing number improves without usability | compare useful wall-clock goodput | headline verified file goodput only |
| Unfair QR comparison | new codec gets better setup/conditions | matched experiment manifest | same device/distance/light/file/duration |
| Handheld motion | custom grid works only on tripod | motion/marker confidence trials | persistent fiducials + adaptive grid + declared operating envelope |
| Security/privacy confusion | users assume optical means automatically secure | threat model | document that visible light can be observed/recorded |
| Malicious payload | receiver downloads unsafe content | file type / origin irrelevant | treat bytes as untrusted; no automatic execution/open |
| Huge raw logs | repo/storage becomes unmanageable | artifact sizes | summary in repo, raw export/artifact policy |
| Licensing ambiguity | external adoption blocked | repo metadata | select an explicit OSS license before public launch |

---

## Highest-priority risks now

### P0 — measurement correctness

- zero-window CV;
- phase leakage;
- actual TX timing;
- fixed-order confounding.

If these are wrong, later optimizations can produce a false winner.

### P1 — optical timing

- transition tearing;
- rolling shutter;
- auto exposure/focus;
- ROI geometry.

### P2 — compute

- full-frame fallback;
- decoder cost;
- main-thread scheduling.

### P3 — product reliability

- FEC recovery;
- hash verification;
- capability adaptation;
- cross-device behavior.

---

## Security note

“Air-gapped” or “no network” does **not** mean secret. A nearby camera may be able to observe the same optical signal. Optical Link should make confidentiality a separate feature/threat-model decision rather than imply encryption from the transport medium alone.
