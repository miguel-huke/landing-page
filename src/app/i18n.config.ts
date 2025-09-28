// src/app/i18n.config.ts
import { importProvidersFrom, EnvironmentProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function httpLoaderFactory(http: HttpClient) {
 
  return new TranslateHttpLoader();
}

export function provideI18n(): EnvironmentProviders {
  return importProvidersFrom(
    TranslateModule.forRoot({
      defaultLanguage: 'pt',
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  );
}
