# Findings

The purpose of this file is to separate **supported findings** from attractive but not-yet-supported explanations.

## Supported by the experiments

### 1. Raw peak is not a useful standalone metric

Short trials have produced numbers as high as **20.15 KB/s**, but the same receiver can move substantially during a longer benchmark. Any result that is not paired with repetition, controls, and duration should be labeled a raw observation, not a stable channel rate.

### 2. The channel exhibits a saturation region

At low/moderate QR rates, the receiver can decode nearly every transmitted frame. At higher QR rates, transmitted load increases much faster than useful goodput.

Example from V0.17 with 1200 B payload:

- 6 QR/s → 6.60 KB/s, 91.7% efficiency
- 20 QR/s → 9.60 KB/s, 40.0% efficiency
- 24 QR/s → 6.60 KB/s, 22.9% efficiency

This demonstrates that maximizing QR/s is not equivalent to maximizing goodput.

### 3. 1000 B × 8 QR/s is a useful diagnostic operating point

This point has repeatedly been decodable and has a simple theoretical rate of exactly **8.00 KB/s**. It reached 100% efficiency in a short V0.17 window and 99% active efficiency in V0.18, making it a strong baseline for receiver diagnostics.

### 4. Scheduled camera maintenance is not justified by current data

V0.18 reported a maintenance A/B wall-goodput ratio of **0.77×**. Scheduled resets therefore reduced useful wall-clock performance in that experiment.

The current receiver architecture should prefer:

1. ROI recovery
2. decoder/canvas reset
3. full-frame reacquire
4. camera restart only as a last resort

### 5. Camera availability was not the dominant loss in V0.19

V0.19 produced:

- availability: **100.0%**
- hard downtime: **0 s**
- L3 camera restart: **0**
- goodput: **5.58 KB/s**
- efficiency: **69.8%**

The receiver was available but failed to recover roughly 30% of the theoretical payload. This moves attention toward decode scheduling / optical-frame capture / ROI decode success rather than camera restart downtime.

### 6. A simple monotonic thermal-throttling explanation is insufficient

V0.19 decay was **+13.5%**, meaning later windows were not simply slower than early windows. Thermal effects may still exist, but the data does not support treating thermal throttling as the sole dominant mechanism.

## Strong hypotheses being tested

### A. Decoder sampling cadence is too sparse

At 8 QR/s, one QR remains on screen for 125 ms. A 30 fps camera can expose roughly 3–4 frames during that interval, but a 12 Hz decoder creates only ~1.5 decode opportunities per QR on average.

V0.20 directly tests whether moving from 12 → 18 → 24 Hz → camera-driven increases unique-frame efficiency.

### B. ROI/full-frame scheduling may waste decode budget

When ROI decoding fails and the system falls back to full-frame decoding, latency can increase sharply. V0.18 showed an ROI median around 34 ms, versus roughly 16 ms in an earlier V0.11 report. The exact cause is not yet isolated.

### C. Startup convergence contaminates early windows

V0.19 showed particularly poor first-minute windows before approaching ~5.5 KB/s. Autofocus, exposure, ROI acquisition, browser JIT/GC, or synchronization could all contribute. V0.20 therefore includes a 60 s warm-up before scored trials.

## Claims that should NOT be made yet

- “QR optical transfer is limited to ~8 KB/s.” — false; this is a browser/decoder operating point, not a QR or optical theoretical limit.
- “iPhone hardware can only process 30/60 fps.” — the browser camera API exposure is not the same as native high-FPS video capture capability.
- “20.15 KB/s is the stable speed.” — it was a broad raw peak, not a validated long-duration rate.
- “Thermal throttling is the bottleneck.” — not established.
- “AirDrop can be replaced by this system.” — current throughput is orders of magnitude lower.

## Current best interpretation

The current evidence supports a layered model:

```text
TX theoretical payload rate
        ↓
screen refresh / temporal presentation
        ↓
camera exposure and frame delivery
        ↓
ROI tracking / crop quality
        ↓
decoder scheduling + latency
        ↓
unique-frame decode probability
        ↓
wall-clock goodput
```

At the V0.19 operating point, the most actionable loss is between **camera-delivered frames and unique QR decode success**.
