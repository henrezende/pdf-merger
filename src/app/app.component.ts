import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { FileItem, FileKind } from './models/file-item';
import { PdfMergeService } from './services/pdf-merge.service';

type StatusKind = 'info' | 'success' | 'error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  items: FileItem[] = [];
  outputName = 'merged.pdf';
  isDragOver = false;
  isMerging = false;
  status: { kind: StatusKind; text: string } | null = null;

  private seq = 0;

  constructor(private readonly merger: PdfMergeService) {}

  get hasUnsupported(): boolean {
    return this.items.some((i) => i.kind === 'unsupported');
  }

  get canMerge(): boolean {
    return !this.isMerging && this.items.length > 0 && !this.hasUnsupported;
  }

  trackById = (_: number, item: FileItem): string => item.id;

  // --- file intake -------------------------------------------------------

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
    }
    input.value = ''; // let the user re-add the same file later
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  private addFiles(list: FileList): void {
    const added = Array.from(list).map((f) => this.toItem(f));
    this.items = [...this.items, ...added];
    this.status = null;
  }

  private toItem(file: File): FileItem {
    return {
      id: `f${this.seq++}`,
      file,
      name: file.name,
      kind: this.kindOf(file),
      sizeLabel: this.formatSize(file.size),
    };
  }

  private kindOf(file: File): FileKind {
    if (this.merger.isPdf(file)) return 'pdf';
    if (this.merger.isImage(file)) return 'image';
    return 'unsupported';
  }

  // --- ordering ----------------------------------------------------------

  reorder(event: CdkDragDrop<FileItem[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  moveUp(i: number): void {
    if (i > 0) moveItemInArray(this.items, i, i - 1);
  }

  moveDown(i: number): void {
    if (i < this.items.length - 1) moveItemInArray(this.items, i, i + 1);
  }

  sortByName(): void {
    // Numeric-aware sort so "2-a.pdf" comes before "10-b.pdf".
    this.items = [...this.items].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );
  }

  remove(item: FileItem): void {
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  clearAll(): void {
    this.items = [];
    this.status = null;
  }

  // --- merge -------------------------------------------------------------

  async merge(): Promise<void> {
    if (!this.canMerge) return;
    this.isMerging = true;
    this.status = { kind: 'info', text: 'Merging…' };
    try {
      const result = await this.merger.merge(this.items.map((i) => i.file));
      this.download(result.bytes);
      const summary = `Created a ${result.pageCount}-page PDF from ${this.items.length} file(s).`;
      this.status = result.failures.length
        ? {
            kind: 'error',
            text: `${summary} Skipped: ${result.failures
              .map((f) => `${f.name} (${f.message})`)
              .join('; ')}`,
          }
        : { kind: 'success', text: summary };
    } catch (e) {
      this.status = { kind: 'error', text: e instanceof Error ? e.message : 'Merge failed.' };
    } finally {
      this.isMerging = false;
    }
  }

  private download(bytes: Uint8Array): void {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.resolvedName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private resolvedName(): string {
    const name = this.outputName.trim() || 'merged.pdf';
    return /\.pdf$/i.test(name) ? name : `${name}.pdf`;
  }

  // --- helpers -----------------------------------------------------------

  iconFor(kind: FileKind): string {
    if (kind === 'pdf') return '📄';
    if (kind === 'image') return '🖼️';
    return '⚠️';
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
