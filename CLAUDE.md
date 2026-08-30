# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page marketing site for Felicity IDC (a Bangladeshi carrier-neutral data center company). It is a "spatial, engineered digital flagship" page: a scroll-driven narrative built over a WebGL 3D scene, with no backend, no build step, and no package manager — just `index.html`, `css/style.css`, and three `js/` files loaded directly as `<script>` tags.

## Running / previewing

There is no build, bundle, lint, or test tooling in this repo (no `package.json`). To preview changes, serve the directory statically and open it in a browser, e.g.:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000/index.html`. Opening `index.html` directly via `file://` mostly works but is not guaranteed (fetches, module-like behavior, fonts).

Third-party libraries (Three.js r128, GSAP 3.12.5 + ScrollTrigger) are loaded from cdnjs in `index.html` `<head>` — there is nothing to install locally.

This is also published as a static GitHub Pages-style site (`.nojekyll` at the root disables Jekyll processing), so any file paths must stay root-relative and work with no server-side processing.

## Architecture

The page has two independent visual layers that must each keep working if the other is unavailable:

1. **DOM/CSS content layer** — the actual copy, sections, forms — always renders regardless of WebGL support.
2. **3D scene layer** (`js/scene.js`, `js/icons.js`) — a fixed, full-viewport `<canvas id="scene-canvas">` sitting behind the content (`z-index:0`) that animates as the user scrolls. `js/scene.js` feature-detects WebGL and the `THREE` global; if either is missing, it adds a `no-webgl` class to `<body>` (which CSS uses to show a static fallback grid, `#webgl-fallback-grid`) and sets `window.FelicityScene = { ready:false }` — nothing downstream should assume the scene exists without checking this flag.

Script load order in `index.html` matters: `scene.js` → `icons.js` → `app.js`. `icons.js` bails out immediately (`if(!window.FelicityScene || !window.FelicityScene.ready) return;`) if the scene failed to initialize, and reads `window.FelicityScene.scene` to attach floating icon meshes to it. `app.js` (loader, header, cursor, GSAP `.reveal` animations, counters, form validation) is written to be fully independent of the 3D scene, so the page stays functional with GSAP/Three.js absent or WebGL disabled.

### The signature 3D object (`js/scene.js`)

There is one proprietary Three.js object (`signature`, a `THREE.Group`) built from named child groups — `fFrame`, `rackFrame`, `fibreRing`, `fibreRing2`, `powerPath`, `coolingBlades`, `modularBlock`. It represents power + cooling + connectivity as one continuous form rather than separate icon graphics. A plain `state` object (`explode`, `groupRotY`, `camZ`, `riseY`, `ringSpread`, `contract`, etc.) is mutated by GSAP `ScrollTrigger` timelines keyed to specific section IDs (`#infrastructure`, `#connectivity`, `#orbital`, `#operations`, `#contact`), and `applyState()` reads that state every animation frame to reposition/rescale the child groups. To change what the scene does at a given scroll section, edit the corresponding `ScrollTrigger` timeline block rather than the mesh geometry.

Floating "icon" meshes in `js/icons.js` are small hand-built Three.js geometries (not flat icon-library glyphs) that orbit the signature object independently; each is produced by a `make*Icon()` factory function and driven by its own `userData` (angle, radius, speed) in `driftIcons()`.

### Section wiring conventions (`index.html`)

- Sections that drive a specific 3D scene state carry `data-scene="..."` (`core`, `exploded`, `fibre`, `orbital`, `contract`) — informational hooks matched by `id` in `scene.js`'s ScrollTrigger setup, not read generically.
- `.reveal` elements fade/slide in via a single generic ScrollTrigger loop in `app.js`; add the class rather than writing bespoke reveal code per-section.
- Numeric stat elements use `data-count="1200"` (+ optional `data-suffix`) for an animated count-up, or `data-static="11 kV"` for a value copied verbatim — handled generically in `app.js`, no per-metric JS needed.
- The industries list (`#industries`) stores each row's expandable copy in `data-desc` on `.industry-row`; `app.js` copies it into the `.industry-desc` child and toggles an `.open` class on hover/click.
- The locations map (`#locations`) is a hand-plotted inline SVG, not a mapping library. The comment above the `<svg>` documents the lon/lat → x/y transform used (`lonMin 88.0/lonMax 92.7`, `latMin 20.5/latMax 26.6` → a 300×400 viewBox); reuse that formula if adding/moving a pin rather than eyeballing coordinates.
- The contact form (`#contact-form`) has no backend — `app.js` only does client-side validation (`validateField`) and simulates submission with a `setTimeout`. Do not assume a real submit endpoint exists.

### Styling conventions (`css/style.css`)

- Design tokens (brand colors, font stacks, easing) are CSS custom properties on `:root` (`--navy`, `--orange`, `--signal`, `--serif`, `--sans`, `--mono`, `--ease`) — use these rather than hardcoding hex values or font names.
- Fonts: Cormorant Garamond (serif headlines, class `serif-xl`), Inter (body/sans), IBM Plex Mono (labels/mono, class `mono-label`), loaded via Google Fonts `<link>` in `index.html`.
- The file is organized into numbered comment-delimited sections (`0. ROOT / RESET`, `1. 3D SCENE CANVAS`, ...) mirroring the page's section order — add new section styles in the corresponding numbered block, not at the end of the file.
- Respect `prefers-reduced-motion`: both `app.js` and `scene.js` check `window.matchMedia('(prefers-reduced-motion: reduce)')` and shorten/skip animation accordingly — any new animation should follow the same pattern.
