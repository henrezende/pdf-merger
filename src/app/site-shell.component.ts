import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="site-shell">
      <nav class="site-nav" aria-label="Main navigation">
        <div class="site-nav__links">
          <a routerLink="/" routerLinkActive="site-nav__link--active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
          <a routerLink="/about" routerLinkActive="site-nav__link--active">About</a>
          <a routerLink="/privacy" routerLinkActive="site-nav__link--active">Privacy</a>
        </div>
      </nav>
      <main class="site-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .site-shell { min-height: 100vh; display: flex; flex-direction: column; }
    .site-nav { width: min(1120px, 100%); margin: 0 auto; padding: 18px 24px; display: flex; align-items: center; justify-content: flex-end; gap: 20px; }
    .site-nav a { color: #475569; text-decoration: none; }
    .site-nav a:hover { color: #4338ca; text-decoration: underline; }
    .site-nav__links { display: flex; gap: 20px; font-size: 13px; }
    .site-nav__links .site-nav__link--active { color: #4338ca; font-weight: 650; }
    .site-main { flex: 1; }
    @media (max-width: 540px) {
      .site-nav { padding: 16px 18px; justify-content: flex-start; }
      .site-nav__links { gap: 16px; }
    }
  `],
})
export class SiteShellComponent {}
