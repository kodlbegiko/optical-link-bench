# Optical Link

**A reproducible research platform for zero-network, zero-pairing, screen-to-camera data transfer.**

Optical Link started as a browser benchmark for animated QR transfer. The project is now expanding toward a broader goal:

> **Keep the practical advantages of QR-based transfer — no network, no pairing, no account, air-gap compatible, screen-only sender and camera-only receiver — while building a faster optical data link for real file transfer.**

The project intentionally keeps the existing QR benchmark as the baseline. We will not claim a new codec is better until it wins under the same device, distance, lighting, duration, integrity and repeatability conditions.

## Current evidence

| Metric | Current evidence |
|---|---:|
| Short raw peak observed | **20.15 KB/s** |
| Validated 30 s QR result | **10.00 KB/s** |
| V0.18 validated sustained | **7.86 KB/s** @ 1000 B × 8 QR/s |
| V0.19 10-minute wall goodput | **5.58 KB/s** |
| V0.19 efficiency | **69.8%** |
| V0.19 camera availability | **100.0%** |
| V0.20.8 | decoder-sampling experiment pending clean full run |

These are browser/decoder benchmark results, **not** hardware limits of the iPhone camera, QR Code, or optical communication.

## Program structure

Optical Link is organized into three tracks:

1. **Optical Link Bench** — measurement integrity, reproducible experiments, raw telemetry, statistical comparison.
2. **Optical Link QR** — practical browser-first file transfer using standard QR as baseline/bootstrap.
3. **Optical Link HS** — a high-speed optical modem using persistent locators, a custom payload field, temporal synchronization, FEC and adaptive rate control.

The intended product architecture is hybrid:

```text
Small payload / discovery              Large payload
          │                                  │
          ▼                                  ▼
    Standard QR                        Optical Link HS
          │                                  │
          └──────── same UX / protocol ──────┘
```

QR is not discarded. It remains the universal bootstrap and small-payload mode. High-speed optical coding is used only where it has a measurable advantage.

## Core product constraints

A successful high-speed mode should preserve:

- no Internet requirement
- no Wi-Fi/Bluetooth pairing
- no account
- no cloud upload
- air-gap compatible one-way transfer
- sender only needs an ordinary display
- receiver only needs an ordinary camera
- arbitrary file transfer
- integrity verification
- browser-first operation where practical
- open, reproducible benchmark results

## Performance targets

Targets are gates, not claims:

| Stage | Target |
|---|---|
| Measurement baseline | trustworthy QR benchmark with raw telemetry |
| Optical Grid proof | **≥50 KB/s useful goodput** |
| Competitive optical mode | **≥200 KB/s sustained** |
| QR-frontier target | **≥300 KB/s sustained useful goodput** |
| Stretch | **≥500 KB/s** |
| Moonshot | **1 MB/s useful goodput** if hardware/browser evidence supports it |

A target only counts when a real file is reconstructed and its cryptographic hash passes. Peak screenshots do not count.

## Repository map

```text
.
├── index.html                    # Optical Link project / research website
├── bench.html                    # current V0.20.8 benchmark UI
├── src/app.js                    # current benchmark implementation
├── site.css / site.js            # project website
├── docs/
│   ├── OPTICAL_LINK_VISION.md    # product thesis and system architecture
│   ├── OPTICAL_HS_PROTOCOL.md    # proposed high-speed protocol
│   ├── ROADMAP_V2.md             # staged engineering/research roadmap
│   ├── RISK_REGISTER.md          # failure modes, detection and mitigations
│   ├── BENCHMARK_RESULTS.md      # historical quantitative evidence
│   ├── FINDINGS.md               # supported findings vs hypotheses
│   ├── TEST_METHODOLOGY.md       # benchmark validity rules
│   └── PRODUCTION.md             # deployed endpoints
├── data/benchmark-summary.csv
└── archive/                      # preserved historical benchmark snapshots
```

## Read first

- [`docs/OPTICAL_LINK_VISION.md`](docs/OPTICAL_LINK_VISION.md)
- [`docs/OPTICAL_HS_PROTOCOL.md`](docs/OPTICAL_HS_PROTOCOL.md)
- [`docs/ROADMAP_V2.md`](docs/ROADMAP_V2.md)
- [`docs/RISK_REGISTER.md`](docs/RISK_REGISTER.md)
- [`docs/TEST_METHODOLOGY.md`](docs/TEST_METHODOLOGY.md)
- [`docs/BENCHMARK_RESULTS.md`](docs/BENCHMARK_RESULTS.md)

## Research policy

1. Change one causal variable at a time when diagnosing a bottleneck.
2. Preserve failures and invalidated peaks.
3. Separate raw peak, repeatable, sustained, endurance and useful-file goodput.
4. Record actual timing instead of trusting requested timer rates.
5. Compare codecs under matched physical conditions.
6. Do not call a result “faster” unless integrity, duration and repeatability gates also pass.

## License

No license has been selected yet. Until one is added, normal copyright applies.
