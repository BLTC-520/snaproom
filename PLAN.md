# PLAN.md

Roadmap for Snaproom — vision and planned features. Sections marked
**Shipped** are built; everything else is not yet built. For the current
operational guide, see [AGENTS.md](./AGENTS.md).

## Vision

Snaproom turns a flat floor plan or hand-drawn sketch into a fully furnished,
walkable 3D world in minutes. Upload a plan, and Snaproom reconstructs the
space, fills it with furniture that fits the layout, and lets you walk through
your future home before a single wall goes up.

## Input → Output

**Input** — one of:

- A normal photo of an artist-inspired / styled room.
- A 2D floor plan.

**Output** — a 3D space reconstructed from the uploaded image.

If a **2D floor plan** is uploaded, an extra step runs first: FAL AI generates a
2D visualization (a rendered view) of the floor plan, and *that* render is what
gets sent into the image blaster pipeline. A normal room photo skips this and
goes straight into the pipeline.

> Status: the floor-plan → FAL 2D visualization step has no skill or script
> yet. Today the pipeline (see AGENTS.md) starts from a source image directly.

## Shipped: AR handoff (web → mobile)

The QR-code handoff from the web app to a mobile viewer is **built** — see the
"AR handoff" section in [AGENTS.md](./AGENTS.md). The web app emits a
`snaproom://room?slug=…&host=…` QR when a world is ready; the Expo app in
`mobile/` opens it in a WebView of the web viewer.

What the mobile app shows today is the **web 3D viewer wrapped in a WebView** —
a touch-first walk-through, not yet a camera-passthrough AR scan.

## Features (planned)

1. **Live camera AR** — render the world over the phone's live camera feed
   (gyroscope + plane detection) instead of a WebView. Needs a custom dev build;
   not possible in plain Expo Go.
2. **Semantic layer** — live, clickable annotations over objects; tapping an
   object surfaces its details. Applies to both the web viewer and mobile.
