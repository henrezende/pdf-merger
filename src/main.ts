import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { SiteShellComponent } from './app/site-shell.component';

bootstrapApplication(SiteShellComponent, appConfig)
  .catch((err) => console.error(err));
