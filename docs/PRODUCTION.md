# Current Production Benchmark

Current deployed generation: **V0.20.8**.

## Endpoints

- Base/versioned page: `https://optical-link-bench.vercel.app/v0208.html`
- TX: `https://optical-link-bench.vercel.app/v0208.html#tx`
- RX: `https://optical-link-bench.vercel.app/v0208.html#rx`
- Versioned production asset: `/app-v0208.js`

## Production hardening incorporated by V0.20.8

- versioned HTML and JavaScript asset paths
- no runtime jsDelivr/unpkg dependency for QR encoder/decoder
- qrcode + jsQR bundled into same-origin runtime asset
- decoder readiness no longer depends on `window.QRCode/window.jsQR`
- compact `100dvh` layout to keep TX controls and QR visible in one viewport
- packet parser accepts the actual eight-field Data packet structure
- V0.20 decoder-sampling sequence preserved

## Source provenance

`src/app.js` is the clean, readable V0.20.8 source representation maintained in this repository. The Vercel production JavaScript is bundled/minified and therefore is not expected to be byte-identical to `src/app.js`.

The next evidence-producing step is a clean full V0.20.8 physical run; until then, the latest completed long-duration quantitative result remains V0.19.
