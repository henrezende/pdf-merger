import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InfoPageComponent } from './info-page.component';

export const routes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full' },
  {
    path: 'about',
    component: InfoPageComponent,
    data: {
      title: 'About PDF Merger',
      intro: 'A simple tool for combining PDFs and images into one PDF file.',
      sections: [
        {
          heading: 'Private by design',
          paragraphs: [
            'PDF Merger processes your selected files in your browser. The files are not uploaded to a server by this app.',
            'PDF pages are copied into a new document, and supported images are converted into PDF pages before you download the result.',
          ],
        },
        {
          heading: 'How to use it',
          paragraphs: [
            'Choose or drop PDF and image files, arrange them in the order you want, choose an output name, then select Merge & Download.',
            'The app is provided as-is. Please keep your original files and check the downloaded PDF before relying on it.',
          ],
        },
      ],
    },
  },
  {
    path: 'privacy',
    component: InfoPageComponent,
    data: {
      title: 'Privacy',
      intro:
        'Your documents stay on your device while PDF Merger processes them.',
      sections: [
        {
          heading: 'Files you select',
          paragraphs: [
            'PDF Merger reads the files you choose in your browser to create the combined PDF. The app does not upload those files to its hosting provider or to a PDF processing server.',
            'The generated PDF is downloaded directly by your browser. You control the files you select and the downloaded result.',
          ],
        },
        {
          heading: 'Website data',
          paragraphs: [
            'This app currently does not include an account, backend, or analytics integration. Its hosting provider may process standard technical request data needed to deliver the website.',
            'If advertising, analytics, or other third-party services are added, this notice should be updated to identify those services and explain any data they collect before they are enabled.',
          ],
        },
      ],
    },
  },
  { path: '**', redirectTo: '' },
];
