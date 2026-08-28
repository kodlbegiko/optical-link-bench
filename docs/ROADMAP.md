# Roadmap

## P0 — finish V0.20 decoder-sampling experiment

Run one clean V0.20.8 sequence after infrastructure stabilization and record:

- 12 Hz goodput / efficiency / attempts
- 18 Hz
- 24 Hz
- camera-driven 90 s
- camera-driven 300 s
- ROI median ms
- full-frame median ms
- camera presented FPS
- 10 s CV

Success criterion: determine whether V0.19's 69.8% efficiency is primarily a sampling-cadence problem.

## P1 — improve receiver efficiency before increasing TX load

If camera-driven sampling materially improves efficiency:

1. keep TX at 1000 B × 8/s
2. target ≥95% unique-frame efficiency
3. reduce ROI/full-frame fallback cost
4. only then increase QR/s

If camera-driven sampling does **not** improve efficiency, next diagnostics should isolate:

- exposure timing / rolling shutter
- QR transition tearing
- autofocus / exposure drift
- ROI geometry and perspective distortion
- display refresh synchronization

## P2 — frame-synchronous transmitter

Replace timer-only QR updates with display-frame-aware scheduling where practical.

Questions:

- does aligning changes to `requestAnimationFrame()` reduce partially transitioned QR frames?
- is an integer display-frame hold more reliable than an arbitrary QR/s target?

## P3 — alternative visual coding

Only after the QR baseline is well characterized:

- multi-QR tiles
- lower-complexity custom 2D symbols
- color channels
- larger modules / lower QR version with external framing
- fountain / erasure coding across frames

The goal is to increase information per camera frame without making decoder complexity the new bottleneck.

## P4 — native receiver comparison

A browser ceiling is not a device ceiling. A native iOS implementation could test:

- AVFoundation frame rates
- tighter exposure/focus control
- Metal / Accelerate / native image processing
- camera timestamps
- more deterministic frame acquisition

This would separate WebKit constraints from optical/hardware constraints.

## P5 — reproducible public benchmark harness

Longer term:

- export raw per-window JSON/CSV
- store benchmark metadata automatically
- provide a run ID
- save device/browser capabilities
- attach environment notes
- compare runs statistically rather than from screenshots
