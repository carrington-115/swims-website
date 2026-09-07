# components/ui

Reusable, presentational primitives with no knowledge of SWIMS pages: buttons,
cards, badges, inputs, accordions.

Rules:

- No data fetching, no copy, no page-specific naming.
- Variants are declared with `cva` and exported alongside the component
  (see button.tsx, the reference implementation).
- Colours, radii and shadows come from tokens in app/globals.css -- never a raw
  hex value or a one-off pixel radius.
- Add `"use client"` only when the component itself uses state, effects or
  browser events.

See ../../docs/COMPONENTS.md.
