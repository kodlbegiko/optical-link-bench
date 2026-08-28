# Benchmark Results

This document consolidates the quantitative results visible in experiment reports. Values are preserved as reported, including runs later judged to be drift-contaminated.

## Headline history

| Version | Benchmark focus | Headline result | Validation note |
|---|---|---:|---|
| V0.10 | extreme search | 8.50 KB/s | stable row, but strong control drift |
| V0.11 | repeatable peak | 13.77 KB/s median | CV 4.6%; control drift remained |
| V0.12 | local peak | 13.39 KB/s median | CV 18.6%; severe drift |
| V0.13 | drift-normalized | 8.32 KB/s normalized | no sustained candidate |
| V0.14 | paired benchmark | 1.385× anchor best ratio | no full pass |
| V0.15.1 | full auto | 10.00 KB/s / 30 s | validated at 850 B × 14/s |
| V0.16 | exhaustive | 5.49 KB/s / 45 s | health drift 59.5%; no full pass |
| V0.17 | convergent | 9.60 KB/s burst | no 30/90 s pass |
| V0.18 | stability A/B | 7.86 KB/s | validated sustained, 1000 B × 8/s |
| V0.19 | 10-min continuous | 5.58 KB/s | availability 100%, efficiency 69.8% |
| V0.20.8 | decoder sampling | pending | infrastructure now hardened |

## V0.10 — extreme-value search

Best reported stable candidate:

```text
500 B · Hold 3 · 20 QR/s
Goodput: 8.50 KB/s
Efficiency: 85.0%
```

Selected rows visible in the report:

| Payload | Hold | QR/s | Goodput | Efficiency | Judgment |
|---:|---:|---:|---:|---:|---|
| 500 B | 2 | 30 | 8.33 KB/s | 55.6% | stable |
| 500 B | 3 | 20 | 8.50 KB/s | 85.0% | stable |
| 500 B | 4 | 15 | 7.33 KB/s | 97.8% | stable |
| 700 B | 4 | 15 | 7.93 KB/s | 75.6% | stable |
| 1200 B | 6 | 10 | 7.60 KB/s | 63.3% | stable |
| 1500 B | 2–6 | 10–30 | 0 B/s | 0% | unstable |

Control shown in report: **3.60 KB/s → 1.60 KB/s**.

## V0.11 — repeatable peak

```text
Candidate: 700 B · H3 · 20 QR/s
Median: 13.77 KB/s
Min–Max: 12.83–14.00 KB/s
CV: 4.6%
Median efficiency: 98.3%
ROI median: 16.0 ms
```

Control drift: **10.80 → 8.60 KB/s**.

## V0.12 — local peak

```text
Candidate: 900 B · 18/s
Peak median: 13.39 KB/s
Min–Max: 10.80–15.75 KB/s
CV: 18.6%
Median efficiency: 81.1%
```

Selected observed goodputs:

- 850 B × 18/s → 14.33 KB/s
- 900 B × 18/s → 13.39 KB/s
- 700 B × 28/s → 12.84 KB/s
- 850 B × 20/s → 11.90 KB/s

The control series changed dramatically during the run, so the highest single observed row is not treated as the validated operating point.

## V0.13 — drift-normalized

```text
Raw peak: 9.83 KB/s @ 850 B × 18/s
Drift-normalized peak: 8.32 KB/s @ 900 B × 19/s
Raw median near normalized winner: 9.80 KB/s
Control median: 10.06 KB/s
Paired drift shown: 32.0%
Validated sustained: none
```

## V0.14 — paired benchmark

```text
Raw peak: 7.42 KB/s @ 850 B × 17/s
Raw CV: 30.3%
Anchor baseline: 7.39 KB/s
Anchor trials: 65
Best vs anchor: 1.385× @ 850 B × 18/s
Relative CV: 45.7%
Validated sustained: none
```

## V0.15.1 — full auto benchmark

```text
Broad raw peak: 20.15 KB/s @ 800 B × 30/s
Raw efficiency: 85.2%
15 s sustained peak: 8.27 KB/s @ 900 B × 14/s
15 s efficiency: 65.7%
30 s endurance peak: 10.00 KB/s @ 850 B × 14/s
30 s efficiency: 84.0%
Validated sustained: 10.00 KB/s @ 850 B × 14/s
Health baseline: 5.96 KB/s
First→last control drift: 10.6%
```

## V0.16 — exhaustive one-shot

```text
Broad raw peak: 13.42 KB/s @ 1200 B × 12/s (93.3%)
Repeatable peak: 7.38 KB/s @ 1000 B × 8/s (CV 11.8%, Eff 92.3%)
15 s sustained peak: 4.59 KB/s @ 800 B × 12/s (47.8%)
45 s endurance peak: 5.49 KB/s @ 1200 B × 20/s (22.9%, window CV 17.2%)
Health baseline: 4.02 KB/s
Health first→last drift: 59.5%
Validated sustained: none
```

## V0.17 — convergent one-shot

```text
Burst peak: 9.60 KB/s @ 1200 B × 20/s (40.0%)
Repeatable 5 s: 5.28 KB/s @ 1100 B × 8/s (CV 8.3%, Eff 60.0%)
30 s sustained: none passed
90 s endurance: none passed
Recovery: 90.9%
Health drift: 59.5%
Controls: 11
Control median: 2.88 KB/s
```

Notable short-window rows:

- **1000 B × 8/s → 8.00 KB/s, 100% efficiency**
- 1200 B × 6/s → 6.60 KB/s, 91.7%
- 1200 B × 20/s → 9.60 KB/s, 40.0%
- 1200 B × 24/s → 6.60 KB/s, 22.9%

This illustrates saturation: raising QR/s can increase transmitted load while reducing useful efficiency enough that goodput barely improves or declines.

## V0.18 — stability / maintenance A-B

Headline:

```text
Validated sustained: 7.86 KB/s
Operating point: 1000 B × 8/s
Active efficiency: 99.0%
Maintenance A/B wall-goodput ratio: 0.77×
ROI decode median: 34.0 ms
Camera: 720×1280 @ 30 fps
```

Visible comparison rows:

| Wall goodput | Active eff | 10 s CV | Decay | Restarts | Judgment |
|---:|---:|---:|---:|---:|---|
| 7.86 KB/s | 99.0% | 21.0% | -15.6% | 14 | pass |
| 6.04 KB/s | 81.4% | 26.0% | -27.3% | 14 | fail |
| 7.79 KB/s | 69.2% | 27.0% | -14.4% | 7 | fail |
| 9.27 KB/s | 0.0% | 26.9% | +5.7% | 2 | fail / accounting anomaly |

The 9.27 KB/s / 0% efficiency row is internally inconsistent and is intentionally excluded from performance conclusions.

## V0.19 — 10-minute continuous receiver

```text
Fixed TX: 1000 B × 8 QR/s
Theoretical rate: 8.00 KB/s
Wall goodput: 5.58 KB/s
Active goodput: 5.58 KB/s
Efficiency: 69.8%
Unique frames: 3351 / 4801
Availability: 100.0%
Hard camera downtime: 0.0 s
10 s CV: 20.9%
Decay: +13.5%
Recovery ladder: L1 5 · L2 1 · L3 0
Full reacquire: 5
Judgment: fail strict stability threshold
```

Early 10-second windows visible in the report:

| Window | Goodput | Efficiency |
|---|---:|---:|
| 0–10 s | 4.10 KB/s | 51.2% |
| 10–20 s | 1.60 KB/s | 20.0% |
| 20–30 s | 5.80 KB/s | 72.5% |
| 30–40 s | 3.80 KB/s | 47.5% |
| 40–50 s | 3.60 KB/s | 45.0% |
| 50–60 s | 4.90 KB/s | 61.3% |
| 60–70 s | 5.50 KB/s | 68.8% |
| 70–80 s | 5.60 KB/s | 70.0% |
| 80–90 s | 5.50 KB/s | 68.8% |

## V0.20.8 — pending decoder-sampling run

No clean complete quantitative result is recorded yet. The current experiment is designed to compare 12 Hz, 18 Hz, 24 Hz, and camera-driven decode scheduling while holding the optical signal constant.
