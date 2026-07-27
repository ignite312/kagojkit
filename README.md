# KagojKit

Extract pages, merge PDFs, and turn images into one PDF — in the browser.

## Tools

- **Extract pages** — pick pages from one PDF
- **Merge & arrange** — mix PDFs & images, reorder / swap / remove pages
- **Images → PDF** — photos into one PDF

Everything runs client-side. Files stay on your device.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start
```

## Structure

```
app/                 # App Router + styles
components/
  layout/            # Top bar (brand + tools)
  upload/            # Drop zones
  merge/             # Merge + images workspaces
  pdf/               # Extract viewer
hooks/               # PDF load, selection, sizes
lib/pdf/             # extract, merge, compose, thumbs
types/
```

## Tech

Next.js 14 · React 18 · TypeScript · Tailwind · pdf.js · pdf-lib
