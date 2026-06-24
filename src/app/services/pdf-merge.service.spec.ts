import { TestBed } from '@angular/core/testing';
import { PdfMergeService } from './pdf-merge.service';

describe('PdfMergeService', () => {
  let service: PdfMergeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfMergeService);
  });

  it('recognises PDFs by mime type and by extension', () => {
    expect(service.isPdf(new File([], 'a.pdf', { type: 'application/pdf' }))).toBeTrue();
    expect(service.isPdf(new File([], 'a.PDF'))).toBeTrue();
    expect(service.isPdf(new File([], 'notes.txt', { type: 'text/plain' }))).toBeFalse();
  });

  it('recognises common image formats', () => {
    expect(service.isImage(new File([], 'a.jpg', { type: 'image/jpeg' }))).toBeTrue();
    expect(service.isImage(new File([], 'a.png'))).toBeTrue();
    expect(service.isImage(new File([], 'a.webp'))).toBeTrue();
    expect(service.isImage(new File([], 'a.tiff'))).toBeTrue();
    expect(service.isImage(new File([], 'a.pdf', { type: 'application/pdf' }))).toBeFalse();
  });

  it('rejects merging an empty list', async () => {
    await expectAsync(service.merge([])).toBeRejected();
  });
});
