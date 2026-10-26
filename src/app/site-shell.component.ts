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
          <a
            routerLink="/"
            routerLinkActive="site-nav__link--active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
          <a routerLink="/about" routerLinkActive="site-nav__link--active"
            >About</a
          >
          <a routerLink="/privacy" routerLinkActive="site-nav__link--active"
            >Privacy</a
          >
        </div>
      </nav>
      <div
        class="ad-slot ad-slot--horizontal"
        role="complementary"
        aria-label="Top advertisement"
      >
        <span>Advertisement</span>
        <small>Top banner</small>
      </div>
      <main class="site-main">
        <div
          class="ad-slot ad-slot--side"
          role="complementary"
          aria-label="Left advertisement"
        >
          <span>Advertisement</span>
          <small>Side banner</small>
        </div>
        <div class="content-column"><router-outlet></router-outlet></div>
        <div
          class="ad-slot ad-slot--side"
          role="complementary"
          aria-label="Right advertisement"
        >
          <span>Advertisement</span>
          <small>Side banner</small>
        </div>
      </main>
      <div
        class="ad-slot ad-slot--horizontal ad-slot--bottom"
        role="complementary"
        aria-label="Bottom advertisement"
      >
        <span>Advertisement</span>
        <small>Bottom banner</small>
      </div>
    </div>
  `,
  styles: [
    `
      .site-shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .site-nav {
        width: min(1120px, 100%);
        margin: 0 auto;
        padding: 18px 24px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 20px;
      }
      .site-nav a {
        color: #475569;
        text-decoration: none;
      }
      .site-nav a:hover {
        color: #4338ca;
        text-decoration: underline;
      }
      .site-nav__links {
        display: flex;
        gap: 20px;
        font-size: 13px;
      }
      .site-nav__links .site-nav__link--active {
        color: #4338ca;
        font-weight: 650;
      }
      .site-main {
        flex: 1;
        width: min(1240px, 100%);
        margin: 0 auto;
        padding: 0 24px;
        display: grid;
        grid-template-columns: 160px minmax(0, 760px) 160px;
        justify-content: space-between;
        align-items: start;
        gap: 24px;
      }
      .content-column {
        min-width: 0;
      }
      .ad-slot {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border: 1px dashed #cbd5e1;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.42);
        color: #94a3b8;
        font-size: 11px;
      }
      .ad-slot small {
        color: #a0aec0;
        font-size: 10px;
      }
      .ad-slot--horizontal {
        width: min(728px, calc(100% - 48px));
        height: 90px;
        margin: 0 auto 20px;
      }
      .ad-slot--side {
        position: sticky;
        top: 20px;
        width: 160px;
        height: 600px;
      }
      .ad-slot--bottom {
        margin-top: 24px;
        margin-bottom: 24px;
      }
      @media (max-width: 1050px) {
        .site-main {
          grid-template-columns: minmax(0, 760px);
          justify-content: center;
        }
        .ad-slot--side {
          display: none;
        }
      }
      @media (max-width: 540px) {
        .site-nav {
          padding: 16px 18px;
          justify-content: flex-start;
        }
        .site-nav__links {
          gap: 16px;
        }
        .ad-slot--horizontal {
          width: calc(100% - 36px);
          height: 60px;
          margin-bottom: 16px;
        }
        .site-main {
          padding: 0 12px;
        }
      }
    `,
  ],
})
export class SiteShellComponent {}
