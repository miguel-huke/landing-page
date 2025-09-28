import { Component } from '@angular/core';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher';
import { RepoGridComponent } from './repo-grid/repo-grid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LanguageSwitcherComponent, RepoGridComponent],
  template: `
    <header class="header">
      <app-language-switcher></app-language-switcher>
    </header>

    <section class="hero container">
      <h1 class="name">Miguel Huke França</h1>
      <div class="subtitle">Developer</div>
    </section>

    <main class="container">
      <app-repo-grid [defaultUser]="'miguel-huke'"></app-repo-grid>
    </main>

    <footer class="footer">
      <div>© {{ year }} · Feito com Angular</div>
      <div class="social-links">
        <a href="https://www.linkedin.com/in/miguel-huke" target="_blank" rel="noopener" class="btn linkedin">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 
          2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 
          19h-3v-10h3v10zm-1.5-11.4c-1 0-1.9-.9-1.9-1.9s.9-1.8 
          1.9-1.8 1.9.8 1.9 1.8-.9 1.9-1.9 1.9zm13.5 
          11.4h-3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 
          2.9v5.7h-3v-10h2.9v1.3h.1c.4-.7 1.4-1.4 
          2.9-1.4 3.1 0 3.7 2 3.7 4.6v5.5z"/></svg>
          LinkedIn
        </a>

        <a href="https://wa.me/5511993019996" target="_blank" rel="noopener" class="btn whatsapp">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="white" d="M16.1 3C9.2 3 3.6 8.6 3.6 
          15.5c0 2.7.8 5.3 2.2 7.5L3 29l6.2-2.6c2.1 
          1.2 4.5 1.9 6.9 1.9 6.9 0 12.5-5.6 
          12.5-12.5S23 3 16.1 3zm0 22.7c-2.2 
          0-4.3-.6-6.1-1.8l-.4-.2-3.7 
          1.6.8-3.9-.3-.4c-1.3-1.9-2-4-2-6.2 
          0-6.2 5.1-11.3 11.3-11.3S27.4 9.6 27.4 
          15.8s-5.1 11.3-11.3 11.3zm6.1-8.5c-.3-.1-1.7-.9-2-1s-.5-.1-.7.1c-.2.3-.8 
          1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.3-1.6-1.5-1.9-.2-.3 
          0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.3-.3.4-.5.1-.2.1-.4 
          0-.6s-.7-1.8-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 
          0-.6.1-.9.4s-1.2 1.2-1.2 2.9c0 1.7 1.2 
          3.4 1.3 3.6.2.2 2.4 3.7 5.8 5.2.8.3 
          1.5.5 2 .7.8.2 1.5.2 2.1.1.6-.1 
          1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z"/></svg>
          WhatsApp
        </a>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      padding: 1.5rem;
      font-size: .9rem;
      opacity: .8;
    }
    .social-links {
      margin-top: .5rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: .4rem;
      padding: .5rem 1rem;
      border-radius: 999px;
      font-weight: 600;
      text-decoration: none;
      color: white;
    }
    .btn svg {
      width: 18px;
      height: 18px;
    }
    .btn.linkedin { background-color: #0077b5; }
    .btn.whatsapp { background-color: #25d366; }
    .btn:hover { opacity: .9; }
  `]
})
export class AppComponent {
  year = new Date().getFullYear();
}
