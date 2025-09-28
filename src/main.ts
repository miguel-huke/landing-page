import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app';

// ngx-translate (core + http-loader modernos)
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),

    // Registra o TranslateModule no bootstrap (standalone)
    importProvidersFrom(
      TranslateModule.forRoot({
        // use fallbackLang no lugar de defaultLanguage/useDefaultLang
        fallbackLang: 'pt',
        loader: {
          provide: TranslateLoader,
          // Loader moderno: usa useClass (não useFactory) e recebe config via provider separado
          useClass: TranslateHttpLoader
        }
      })
    ),

    // 👉 Este provider injeta o token TRANSLATE_HTTP_LOADER_CONFIG
    //    e define de onde os JSONs serão carregados
    provideTranslateHttpLoader({
      prefix: '/assets/i18n/',   // ou 'assets/i18n/' também funciona
      suffix: '.json'
    })
  ]
});
