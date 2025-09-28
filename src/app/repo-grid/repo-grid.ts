import { Component, Input, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GithubService } from '../github';
import { TranslatorService } from '../translator';

export interface Repo {
  name: string;
  html_url: string;
  description?: string;
  stargazers_count: number;
  language?: string;
  updated_at: string;
  topics?: string[];
}
type RepoView = Repo & { _descByLang?: Record<string,string> };

@Component({
  selector: 'app-repo-grid',
  standalone: true,
  imports: [DatePipe, FormsModule, TranslateModule],
  template: 
  //<div class="filters">
     // <input [(ngModel)]="username" [placeholder]="'REPOS.FILTER_USER' | translate">
     // <input [(ngModel)]="topic"    [placeholder]="'REPOS.FILTER_TOPIC' | translate">
    //  <button (click)="load()">{{ 'REPOS.LOAD' | translate }}</button>
   // </div>

  `
    

    @if (error) { <p style="color:#b91c1c">{{ error }}</p> }
    @if (loading) { <p>Loading…</p> }
    @else if (!error && repos().length === 0) { <p>{{ 'REPOS.EMPTY' | translate }}</p> }
    @else {
      <div class="grid">
        @for (r of repos(); track r.name) {
          <article class="card">
            <a class="title" [href]="r.html_url" target="_blank" rel="noopener">{{ r.name }}</a>
            <p class="desc">{{ getDesc(r) }}</p>
            <div class="meta">
              <span>★ {{ r.stargazers_count }} {{ 'REPOS.STARS' | translate }}</span>
              <span>{{ r.language || '—' }}</span>
              <span>{{ r.updated_at | date:'mediumDate' }}</span>
            </div>
            @if (r.topics?.length) {
              <div class="topics">
                @for (t of r.topics; track t) { <span class="chip">#{{ t }}</span> }
              </div>
            }
          </article>
        }
      </div>
    }
  `
})
export class RepoGridComponent {
  @Input() defaultUser = 'miguel-huke';
  @Input() defaultTopic = '';

  username = this.defaultUser;
  topic = this.defaultTopic;

  loading = false;
  error = '';
  repos = signal<RepoView[]>([]);

  private gh = inject(GithubService);
  private i18n = inject(TranslateService);
  private tr  = inject(TranslatorService);

  constructor(){ this.i18n.onLangChange.subscribe(()=> this.translateAll()); }
  get currentLang(){ return this.i18n.currentLang || 'pt'; }

  async ngOnInit(){ await this.load(); }

  getDesc(r: RepoView){
    return r._descByLang?.[this.currentLang] ?? r.description ?? '—';
  }

  private sourceFor(target: string) {
  const t = (target || 'en').toLowerCase();
  switch (t) {
    case 'en': return 'es'; 
    case 'es': return 'pt'; 
    case 'pt': return 'en'; 
    default:   return 'es'; 
  }
}


private async translateAll(){
  const lang = this.currentLang.toLowerCase();
  const from = this.sourceFor(lang);
  const list = this.repos();
  await Promise.all(list.map(async r => {
    const original = r.description || '';
    if (!original) return;
    r._descByLang ||= {};
    if (r._descByLang[lang]) return;
    r._descByLang[lang] = await this.tr.translate(original, lang, from);
  }));
  this.repos.set([...list]);
}


  async load(){
    this.error=''; this.loading=true;
    try{
      const data = await this.gh.listRepos(this.username.trim());
      const view: RepoView[] = data.map(d => ({
        ...d, _descByLang: { [this.currentLang]: d.description || '—' }
      }));
      // (opcional) filtrar por topic quando reativar busca de topics
      this.repos.set(this.topic ? view.filter(r => r.topics?.includes(this.topic)) : view);
      await this.translateAll();
    }catch(e:any){
      this.error = e?.message || 'Falha ao carregar repositórios';
      this.repos.set([]);
    }finally{ this.loading=false; }
  }
}
