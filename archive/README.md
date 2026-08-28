# Historical Source Snapshots

These files are preserved research artifacts recovered from the earlier benchmark iterations. They are **not** guaranteed to be standalone runnable deployments: some historical HTML files reference a companion `/src.js` or `/app.js` that was deployed separately at the time.

Preserved snapshots:

- `v0.8/index.html` — Auto Runner UI
- `v0.8.2/index.html` — viewport/automatic benchmark refinement
- `v0.14.0/index.html` — paired benchmark generation
- `v0.20.1/index.html` — decoder-sampling benchmark before compact/self-contained fixes
- `v0.20.3/part-01.txt` + `part-02.txt` + `part-03.txt` — exact recovered self-contained HTML split on line boundaries for repository ingestion

To reconstruct the recovered V0.20.3 file locally:

```bash
cat archive/v0.20.3/part-01.txt \
    archive/v0.20.3/part-02.txt \
    archive/v0.20.3/part-03.txt \
  > /tmp/optical-link-bench-v0.20.3.html
```

The current clean V0.20.8 source lives in `src/app.js`. It is a reproducible source representation of the current benchmark logic with local npm imports for `qrcode` and `jsqr`; it is not claimed to be byte-identical to the minified Vercel production bundle.
