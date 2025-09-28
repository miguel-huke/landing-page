import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Repo } from './repo-grid/repo-grid';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private http = inject(HttpClient);

  async listRepos(username: string) {
    const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
    return firstValueFrom(this.http.get<Repo[]>(url));
  }
}
