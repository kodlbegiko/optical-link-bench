# Architecture

## Physical path

```text
Mac / computer display
      │
      │ animated QR sequence
      ▼
iPhone rear camera
      │
      │ getUserMedia / browser video track
      ▼
video frame callback / animation frame
      │
      ├── ROI crop decode
      │       └── jsQR
      │
      └── full-frame fallback decode
              └── jsQR
      ▼
packet parser + CRC32
      ▼
unique sequence accounting
      ▼
benchmark metrics / report
```

## Transmitter

The transmitter generates deterministic synthetic payloads instead of uploading a real file. This removes disk I/O, file size, and file-content entropy as benchmark variables.

Current fixed signal for V0.20:

```text
Payload: 1000 bytes
TX cadence: 8 QR/s
QR error correction: L
Theoretical payload goodput: 8.00 KB/s
```

## Packet types

The benchmark protocol uses text packets with a magic prefix and session identifier.

Conceptual forms:

```text
H | session | version | payload-size | tx-qps
D | session | phase | sequence | previous-summary | payload | crc32
S | session | phase | count | duration-ms | actual-qps
E | session | last-phase
```

`D` packets include CRC32 validation and a deterministic payload body so invalid or corrupted decodes are rejected rather than counted.

## Receiver states

### ROI path

After a successful full-frame detection, the QR location is expanded with padding and stored as a Region of Interest. Subsequent frames first decode the ROI to reduce pixel count and latency.

### Full-frame fallback

If ROI decode fails, the receiver attempts a full-frame decode and uses a successful location to refresh the ROI.

### Recovery philosophy

V0.18/V0.19 experiments changed recovery from scheduled maintenance to fault-triggered escalation:

```text
normal ROI decode
   ↓ fail
ROI reset / full reacquire
   ↓ persistent fail
decoder/canvas reset
   ↓ persistent fail
camera restart (last resort)
```

V0.19 demonstrated that the channel can run 10 minutes with zero hard camera downtime, so future work should avoid restarting camera tracks unless necessary.

## Decoder sampling modes

V0.20 defines four receiver scheduling modes while TX remains fixed:

- 12 Hz
- 18 Hz
- 24 Hz
- Camera-driven: attempt whenever a new camera frame is presented and the decoder is not artificially rate-limited

The important design rule is **do not build a backlog of stale camera frames**. For a temporal optical channel, decoding the newest available frame is more valuable than draining an old queue.

## Metrics

### Goodput

```text
goodput = unique_valid_frames × payload_bytes / measured_duration
```

### Efficiency

```text
efficiency = unique_valid_frames / transmitted_frames
```

### Availability

Fraction of wall-clock time for which the camera pipeline is not in hard restart/downtime.

### CV

Coefficient of variation of short-window goodput, used to quantify temporal stability.

### Decay

Comparison between early and late portions of a long run. A negative number means the later segment is slower.

### Decode latency

ROI and full-frame jsQR execution times are recorded separately because full-frame fallback can materially change decoder capacity.
