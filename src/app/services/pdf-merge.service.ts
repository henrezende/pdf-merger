import { Injectable } from '@angular/core';
import { PDFDocument, PDFImage } from 'pdf-lib';

/** A file that could not be appended, with the reason why. */
export interface MergeFailure {
  name: string;
  message: string;
}

export interface MergeResult {
  bytes: Uint8Array;
  pageCount: number;
  /** Files that were skipped (corrupt, encrypted, undecodable). Empty on full success. */
  failures: MergeFailure[];
}

/**
 * Merges PDFs and images into a single PDF, entirely in the browser.
 *
 * - PDFs are appended page-for-page in order.
 * - JPG/PNG are embedded losslessly; other image formats are re-encoded to
 *   PNG via a canvas (so anything the browser can decode is supported).
 * - Each image becomes one page sized to the image, scaled down to fit A4 so
 *   huge photos don't produce metre-wide pages. Images are never upscaled.
 */
@Injectable({ providedIn: 'root' })
export class PdfMergeService {
  /** A4 portrait in PDF points (1 pt = 1/72"). Used as the image fit box. */
  private readonly fitBox = { width: 595.28, height: 841.89 };

  async merge(files: File[]): Promise<MergeResult> {
    const out = await PDFDocument.create();
    const failures: MergeFailure[] = [];

    for (const file of files) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        if (this.isPdf(file)) {
          await this.appendPdf(out, bytes);
        } else if (this.isImage(file)) {
          await this.appendImage(out, file, bytes);
        } else {
          throw new Error('unsupported file type');
        }
      } catch (e) {
        failures.push({ name: file.name, message: e instanceof Error ? e.message : String(e) });
      }
    }

    const pageCount = out.getPageCount();
    if (pageCount === 0) {
      throw new Error(
        failures.length
          ? `Every file failed: ${failures.map((f) => f.name).join(', ')}`
          : 'No files to merge.'
      );
    }

    out.setProducer('pdf-merger');
    out.setCreator('pdf-merger');
    const merged = await out.save();
    return { bytes: merged, pageCount, failures };
  }

  private async appendPdf(out: PDFDocument, bytes: Uint8Array): Promise<void> {
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((page) => out.addPage(page));
  }

  private async appendImage(out: PDFDocument, file: File, bytes: Uint8Array): Promise<void> {
    const image = await this.embed(out, file, bytes);
    const { width, height } = this.fitWithin(image.width, image.height);
    const page = out.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  /** Embed losslessly for JPG/PNG; otherwise convert to PNG first. */
  private async embed(out: PDFDocument, file: File, bytes: Uint8Array): Promise<PDFImage> {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (file.type === 'image/jpeg' || ext === 'jpg' || ext === 'jpeg') {
      return out.embedJpg(bytes);
    }
    if (file.type === 'image/png' || ext === 'png') {
      return out.embedPng(bytes);
    }
    return out.embedPng(await this.toPng(file));
  }

  /** Scale (down only) to fit inside the A4 box, preserving aspect ratio. */
  private fitWithin(w: number, h: number): { width: number; height: number } {
    const scale = Math.min(this.fitBox.width / w, this.fitBox.height / h, 1);
    return { width: w * scale, height: h * scale };
  }

  /** Decode any browser-supported image and re-encode it as PNG bytes. */
  private async toPng(file: File): Promise<Uint8Array> {
    const url = URL.createObjectURL(file);
    try {
      const img = await this.loadImage(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('canvas 2D context unavailable');
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) {
        throw new Error('image could not be converted');
      }
      return new Uint8Array(await blob.arrayBuffer());
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('could not decode image'));
      img.src = url;
    });
  }

  isPdf(file: File): boolean {
    return file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/') || /\.(jpe?g|png|gif|bmp|webp|tiff?|avif)$/i.test(file.name);
  }
}
