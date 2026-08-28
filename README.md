# Optical Link Bench

A reproducible browser-based benchmark for **screen-to-camera optical data transfer using animated QR codes**.

> Status: active research / experimental. The current goal is to measure and explain the practical throughput ceiling of a Mac display → iPhone camera → browser decoder pipeline before attempting more aggressive encoding schemes.

## 研究目標

這個專案從一個很直接的問題開始：

**如果 MacBook 螢幕高速顯示 QR Code，iPhone 相機持續掃描，實際可以穩定傳多少資料？瓶頸到底在顯示器、相機、瀏覽器、decoder，還是 QR 本身？**

研究不是只追求單次最高 KB/s，而是逐步拆解：

- Burst peak：瞬間最高速度
- Repeatability：同一設定能否重複
- Sustained / endurance：30–600 秒是否仍能維持
- Decoder sampling：12 / 18 / 24 Hz 與 camera-driven 的差異
- Camera / browser drift：長時間性能是否衰退
- Recovery：ROI reset、decoder reset、camera restart 是否有效
- Availability：相機真正可工作的 wall-clock 比例
- Efficiency：實際 unique payload / 理論發射 payload

## 目前最重要的實測結論

截至 V0.19：

| 指標 | 結果 |
|---|---:|
| 曾觀察到的短期 raw peak | **20.15 KB/s** |
| V0.15.1 validated 30s | **10.00 KB/s** |
| V0.18 validated sustained | **7.86 KB/s** @ 1000B × 8 QR/s |
| V0.19 10-min wall goodput | **5.58 KB/s** |
| V0.19 efficiency | **69.8%** |
| V0.19 availability | **100.0%** |
| V0.19 camera hard restart | **0** |

目前證據較支持：**主要瓶頸已從 camera restart / availability，轉向 receiver 沒有解到所有已呈現的 QR frame。**

V0.20 因此固定 `1000B × 8 QR/s`，只比較 decoder sampling 策略，避免再把 payload、QR rate 與 receiver sampling 混成同一個變因。

## Current benchmark design — V0.20.8

One-shot sequence:

1. 10 s link start
2. 60 s warm-up
3. 12 Hz decoder sampling × 90 s
4. 18 Hz × 90 s
5. 24 Hz × 90 s
6. Camera-driven decoder × 90 s
7. Camera-driven endurance × 300 s

The transmitter remains fixed at:

```text
Payload: 1000 B / QR
TX rate: 8 QR/s
Theoretical payload rate: 8.00 KB/s
```

V0.20.8 also bundles QR encoding and decoding libraries locally to remove CDN availability as an experimental variable.

## Repository structure

```text
.
├── README.md
├── index.html                 # clean reproducible web entry
├── src/app.js                 # current clean benchmark source
├── package.json
├── docs/
│   ├── RESEARCH_LOG.md        # version-by-version development history
│   ├── BENCHMARK_RESULTS.md   # quantitative results
│   ├── FINDINGS.md            # supported conclusions vs hypotheses
│   ├── ARCHITECTURE.md        # TX/RX/protocol/metrics
│   ├── TEST_METHODOLOGY.md    # validity and benchmark methodology
│   ├── INCIDENTS.md           # failures and engineering lessons
│   └── ROADMAP.md
├── data/
│   └── benchmark-summary.csv
└── archive/
    ├── v0.8/
    ├── v0.8.2/
    ├── v0.14.0/
    ├── v0.20.1/
    └── v0.20.3/
```

## Why this repository exists

Earlier versions repeatedly produced attractive peak numbers that did not survive controls, repetition, or long-duration tests. This repo intentionally preserves those failures instead of deleting them. The objective is to distinguish:

- **raw peak** from **repeatable peak**
- **active goodput** from **wall goodput**
- a parameter win from a **time/drift artifact**
- a browser limitation from an optical/QR limitation

See [`docs/FINDINGS.md`](docs/FINDINGS.md) and [`docs/BENCHMARK_RESULTS.md`](docs/BENCHMARK_RESULTS.md) before interpreting any headline throughput number.

## Test platform

Primary physical test path used during this research:

```text
MacBook display
   ↓ animated QR
rear camera
   ↓
iPhone browser camera pipeline
   ↓
ROI / full-frame capture
   ↓
jsQR decoder
   ↓
unique-frame accounting + benchmark report
```

The project is browser-first on purpose. Results should **not** be interpreted as the hardware limit of the iPhone camera or the theoretical limit of optical data transfer.

## Current status

- V0.8–V0.19 experimental evidence has been consolidated into this repository.
- V0.20.8 is the current decoder-sampling benchmark design.
- A clean source representation is kept in `src/`; historical snapshots are kept in `archive/`.
- V0.20.8 benchmark results are still pending a clean full run after resolving page-load/CDN/cache issues.

## License

No license has been selected yet. Until one is added, normal copyright applies.
