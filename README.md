# PDF Merger

Merge PDFs **and** images into a single PDF — entirely in the browser. Files are
never uploaded anywhere: all reading, image-to-PDF conversion, and merging happen
client-side, so it works offline and keeps documents private.

Built with **Angular 16** (standalone) + [**pdf-lib**](https://pdf-lib.js.org/) for
PDF/image handling and **Angular CDK** for drag-to-reorder. No backend, no database.

## Features

- **Merge** any mix of PDFs and images into one PDF.
- **Image → PDF**: JPG and PNG are embedded losslessly; other formats the browser
  can decode (WebP, GIF, BMP, TIFF, AVIF…) are converted to PNG automatically.
  Each image becomes one page, scaled down to fit A4 (never upscaled).
- **Ordering**, two ways:
  - **Sort by name** — numeric-aware, so `2-b.pdf` comes before `10-c.pdf`.
  - **Manual** — drag rows by the handle, or use the ▲/▼ buttons.
- Pick the **output file name**; download with one click.
- Unsupported files are flagged and block the merge until removed; a corrupt or
  password-protected PDF is skipped and reported rather than failing the whole job.

## Getting started

```bash
npm install
npm start            # dev server at http://localhost:4300
```

## Build

```bash
npm run build        # production bundle in dist/pdf-merger/
```

The output is a fully static site — host it on any static file server (Nginx,
Azure Static Web Apps, GitHub Pages, S3, …). There is nothing server-side to run.

## Test

```bash
npm test             # Karma + Jasmine unit tests
```

## How it works

| Concern | Where |
| --- | --- |
| UI, file intake, ordering, download | [`src/app/app.component.ts`](src/app/app.component.ts) |
| Merge & image-to-PDF conversion (pdf-lib) | [`src/app/services/pdf-merge.service.ts`](src/app/services/pdf-merge.service.ts) |
| File model | [`src/app/models/file-item.ts`](src/app/models/file-item.ts) |

`PdfMergeService.merge()` creates an empty `PDFDocument`, then walks the files in
order: PDFs are copied page-for-page (`copyPages`), images are embedded
(`embedJpg`/`embedPng`) onto a new page sized to the (scaled) image. The result is
saved to a `Uint8Array` and handed to the browser as a `Blob` download.

## Supported inputs

`.pdf`, `.jpg`/`.jpeg`, `.png`, `.webp`, `.gif`, `.bmp`, `.tif`/`.tiff`, `.avif`
(anything else is flagged as unsupported).
