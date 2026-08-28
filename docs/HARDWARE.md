# Primary Test Hardware

The main experimental path used during this research has been:

## Transmitter

- MacBook with Apple M4
- 24 GB unified memory
- 10-core configuration
- browser-based TX page on the built-in display

## Receiver

- iPhone 17 Pro
- rear camera via browser `getUserMedia()`
- observed browser camera track around 720×1280 @ 30 fps in stability testing
- browser capability testing exposed web camera FPS up to roughly 60 fps, not native 120/240 fps modes

## Important limitation

These hardware labels describe the physical devices used, but benchmark results are primarily a measurement of the **browser-exposed end-to-end pipeline**, not the theoretical capability of the display or camera hardware in isolation.
