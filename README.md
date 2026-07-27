# PageExtracto

Select and extract PDF pages with flexible viewing and selection modes.

A modular Next.js app to preview, select, and extract pages from PDF documents — with grid/scroll views and range selection.

## Features

- Upload & preview PDF pages (drag & drop or click)
- Flexible selection: individual pages, ranges, or select all
- Grid and scroll view modes
- Double-click for full-page preview
- Extract selected pages as a new PDF
- Visual selection indicators (blue highlight, golden range markers)

## Project structure

```
app/                 # Next.js App Router (pages, layout, styles)
components/
  layout/            # Shell UI (header)
  upload/            # File upload
  pdf/
    PDFViewer.tsx    # Viewer orchestrator
    toolbar/         # Toolbar & range banner
    views/           # Grid / scroll layouts
    preview/         # Selection & full-page modals
    page/            # Page canvas renderers
hooks/               # PDF load, selection, page-size hooks
lib/pdf/             # Worker config, sizes, extract, ranges
types/               # Shared TypeScript types
```

## Getting started

```bash
# install
npm install

# develop
npm run dev

# production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Upload a PDF (drag & drop or click)
2. Toggle Grid / Scroll view
3. Select pages (click, range mode, or select all)
4. Double-click a page for full-page preview
5. Extract selected pages

## Tech stack

- [Next.js](https://nextjs.org/) 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- [pdf.js](https://mozilla.github.io/pdf.js/) (preview)
- [pdf-lib](https://pdf-lib.js.org/) (extraction)

## Notes

- `.next/`, `node_modules/`, env files, and PDFs are gitignored — never commit build output or caches.
- Max recommended upload size in the UI: 50MB (client-side only; no server upload).
