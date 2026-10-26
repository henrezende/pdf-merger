import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface InfoSection {
  heading: string;
  paragraphs: string[];
  links?: { label: string; url: string }[];
}

interface InfoPage {
  title: string;
  intro: string;
  sections: InfoSection[];
}

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <article class="info-page" *ngIf="page">
      <a class="info-page__back" routerLink="/">← Back to PDF Merger</a>
      <header class="info-page__header">
        <p class="info-page__eyebrow">PDF Merger</p>
        <h1>{{ page.title }}</h1>
        <p class="info-page__intro">{{ page.intro }}</p>
      </header>
      <section class="info-page__section" *ngFor="let section of page.sections">
        <h2>{{ section.heading }}</h2>
        <p *ngFor="let paragraph of section.paragraphs">{{ paragraph }}</p>
        <ul *ngIf="section.links?.length">
          <li *ngFor="let link of section.links">
            <a [href]="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          </li>
        </ul>
      </section>
    </article>
  `,
  styles: [`
    .info-page { max-width: 760px; margin: 16px auto 48px; padding: 28px 32px 36px; background: rgba(255,255,255,.88); border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 8px 24px rgba(15,23,42,.04); }
    .info-page a { color: #4f46e5; }
    .info-page__back { font-size: 13px; text-decoration: none; }
    .info-page__header { padding: 28px 0 20px; border-bottom: 1px solid #e2e8f0; }
    .info-page__eyebrow { margin: 0 0 8px; color: #6366f1; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    h1 { margin: 0 0 8px; color: #0f172a; font-size: 30px; }
    .info-page__intro { margin: 0; color: #64748b; font-size: 16px; line-height: 1.6; }
    .info-page__section { padding-top: 22px; }
    h2 { margin: 0 0 8px; color: #1e293b; font-size: 17px; }
    .info-page__section p, .info-page__section li { color: #475569; font-size: 14px; line-height: 1.75; }
    .info-page__section p { margin: 0 0 10px; }
    .info-page__section ul { padding-left: 20px; }
    @media (max-width: 540px) { .info-page { margin: 8px 14px 32px; padding: 22px 20px 28px; } h1 { font-size: 26px; } }
  `],
})
export class InfoPageComponent implements OnInit {
  page?: InfoPage;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => (this.page = data as InfoPage));
  }
}
