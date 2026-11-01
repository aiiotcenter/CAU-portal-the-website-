# CAU Website — Portable Download

This package contains the full website source and a local copy of every image, SVG arrow, icon font, Bootstrap resource, Space Grotesk font, and CAU video referenced by the client pages at export time.

## Run locally

1. Install Node.js 22+ and pnpm.
2. Run `pnpm install` in this folder.
3. Run `pnpm dev`.
4. Open the local address shown in the terminal.

The website now resolves visual resources from `client/public/assets/` rather than managed `/manus-storage/` URLs or CDN links. The external official CAU links inside content and the assistant's cited source links intentionally remain external.

## Assistant note

The source-grounded assistant requires the server-side environment variables supplied by the managed platform (including the LLM service credentials). The downloadable code includes the assistant and its safe local catalogue fallback, but the live LLM answer service will require equivalent credentials/configuration in any external hosting environment.
