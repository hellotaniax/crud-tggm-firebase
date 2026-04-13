// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/App.module'; // Importa el AppModule
 
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));