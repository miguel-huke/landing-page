import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [NgFor, TranslateModule],
  template: `
    <label style="margin-right:.5rem">{{ 'LANG.LABEL' | translate }}</label>
    <select (change)="change($event)" [value]="current">
      <option *ngFor="let l of langs" [value]="l">{{ l.toUpperCase() }}</option>
    </select>
  `
})
export class LanguageSwitcherComponent {
  langs = ['pt','en','es'];
  current = localStorage.getItem('lang') || 'pt';
  constructor(private t: TranslateService){ this.t.use(this.current); }
  change(e: Event){
    const lang = (e.target as HTMLSelectElement).value;
    this.current = lang; this.t.use(lang); localStorage.setItem('lang', lang);
  }
}
