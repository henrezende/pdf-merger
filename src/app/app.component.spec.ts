import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FileItem } from './models/file-item';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppComponent],
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('sorts files by name with numeric awareness (2 before 10)', () => {
    const app = TestBed.createComponent(AppComponent).componentInstance;
    app.items = ['10-c.pdf', '2-b.pdf', '1-a.pdf'].map(
      (name, i): FileItem => ({
        id: `f${i}`,
        file: new File([], name),
        name,
        kind: 'pdf',
        sizeLabel: '0 B',
      })
    );

    app.sortByName();

    expect(app.items.map((i) => i.name)).toEqual(['1-a.pdf', '2-b.pdf', '10-c.pdf']);
  });

  it('blocks merging while an unsupported file is queued', () => {
    const app = TestBed.createComponent(AppComponent).componentInstance;
    app.items = [
      { id: 'a', file: new File([], 'a.pdf'), name: 'a.pdf', kind: 'pdf', sizeLabel: '0 B' },
      { id: 'b', file: new File([], 'b.txt'), name: 'b.txt', kind: 'unsupported', sizeLabel: '0 B' },
    ];

    expect(app.hasUnsupported).toBeTrue();
    expect(app.canMerge).toBeFalse();
  });
});
