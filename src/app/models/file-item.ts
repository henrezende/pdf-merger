export type FileKind = 'pdf' | 'image' | 'unsupported';

/** One file queued for merging, in the order the user arranged it. */
export interface FileItem {
  /** Stable id used for *ngFor trackBy and removal. */
  id: string;
  file: File;
  name: string;
  kind: FileKind;
  /** Human-readable size, e.g. "1.4 MB". */
  sizeLabel: string;
}
