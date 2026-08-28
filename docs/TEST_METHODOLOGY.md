# Test Methodology

## Why the benchmark evolved

A naive throughput benchmark can select the largest number seen during a run. That approach failed here because receiver state changed over time. The methodology therefore evolved from broad search to controlled, repeated, and long-duration experiments.

## Experimental principles

### 1. Change one variable at a time when diagnosing a bottleneck

V0.20 fixes TX at 1000 B × 8 QR/s and varies only decoder cadence. This is preferable to simultaneously changing payload, QR rate, camera settings, and decoder strategy.

### 2. Separate raw, repeatable, sustained, and endurance results

Suggested labels:

- **Raw peak** — one short observation
- **Repeatable peak** — repeated short trials with low dispersion
- **Sustained** — medium-duration result (e.g. 15–30 s)
- **Endurance** — long result (90–600 s)
- **Validated** — passes predefined efficiency/stability criteria

### 3. Use controls to detect time drift

V0.10–V0.16 showed that candidate ranking can be distorted when the receiver degrades or changes state during the experiment. Interleaved anchors and paired controls were introduced for this reason.

### 4. Do not hide failed validation

A candidate that achieves a high raw number but fails CV, efficiency, or endurance must remain recorded as a failed validation. This repo keeps those results intentionally.

## Current V0.20 design

```text
10 s   START / link establishment
60 s   warm-up, not scored
90 s   12 Hz
90 s   18 Hz
90 s   24 Hz
90 s   camera-driven
300 s  camera-driven endurance
```

TX remains 1000 B × 8/s during the scored phases.

## Current strict endurance criteria

The V0.20 report uses approximately:

```text
Efficiency ≥ 90%
10 s CV ≤ 20%
Goodput ≥ 7.2 KB/s
```

These thresholds are research gates, not universal standards.

## Physical setup controls

For comparable runs:

- keep the phone and laptop mechanically fixed
- do not change browser zoom during a run
- do not move the QR relative to the camera
- keep ambient lighting as constant as practical
- avoid screen dimming / lock
- avoid switching apps during the benchmark
- record browser / OS / camera track settings when possible
- allow a defined warm-up rather than scoring immediately after camera start

## Threats to validity

### Browser camera API

The browser does not expose the full native camera capture pipeline. A web result is not a direct measurement of native iPhone camera limits.

### Auto exposure / autofocus / ISP

The device can change exposure, focus, denoise, sharpening, or lens behavior without the benchmark requesting it.

### Display timing

A JavaScript timer requesting N QR/s does not guarantee perfect synchronization with physical display refresh.

### Decoder scheduling

Long jsQR calls can reduce future sampling opportunities. Full-frame fallback can therefore affect the very signal being measured.

### Thermal and runtime state

Thermal conditions, browser garbage collection, JIT state, memory pressure, and background OS activity can change during a long run.

### Benchmark self-heating

An exhaustive benchmark can alter device state enough that later candidates are not comparable to early candidates. V0.16 provided strong evidence for this risk.

## Reporting policy

Whenever possible, report together:

- payload bytes
- requested QR/s
- actual QR/s
- unique QR/s
- goodput
- efficiency
- short-window CV
- ROI/full decode latency
- duration
- controls / drift

A single KB/s value is insufficient.
