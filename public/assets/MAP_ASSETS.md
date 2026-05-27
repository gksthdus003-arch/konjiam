# Map Asset Filenames

Place the provided map images here with these exact names:

- `konjiam-map-base.png`: full background map image
- `konjiam-map-buildings.png`: building-only transparent overlay image

The app falls back to `konjiam-map.svg` when `konjiam-map-base.png` is not present.
Building labels and highlight regions are controlled from `src/data/mockData.ts`.
