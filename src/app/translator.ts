// src/app/translator.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslatorService {
  private http = inject(HttpClient);

  // ⚠️ Troque o endpoint se quiser outro público ou seu self-hosted:
  private libreUrl = 'https://translate.argosopentech.com/translate'; // mais estável para navegador
  // private libreUrl = 'https://libretranslate.de/translate';
  // private libreUrl = 'https://libretranslate.com/translate';

  // 🔁 Bump do prefixo para invalidar cache antigo
  private CACHE_PREFIX = 't:v2:'; 

  private cache = new Map<string, string>();
  private MAX_CHUNK = 450;       // margem segura
  private MIN_RATIO = 0.66;      // guarda de qualidade (2/3 do tamanho do texto original)

  setLibreEndpoint(url: string) { this.libreUrl = url; }

  // ---------- cache ----------
  private key(text: string, to: string, from: string) { return `${this.CACHE_PREFIX}${from}|${to}|${text}`; }
  private read(text: string, to: string, from: string): string | null {
    const k = this.key(text, to, from);
    if (this.cache.has(k)) return this.cache.get(k)!;
    const v = localStorage.getItem(k);
    if (v) { this.cache.set(k, v); return v; }
    return null;
  }
  private write(text: string, to: string, from: string, value: string) {
    const k = this.key(text, to, from);
    this.cache.set(k, value);
    try { localStorage.setItem(k, value); } catch {}
  }

  // ---------- normalização ----------
  private decodeEntities(s: string) {
    return s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  private tidy(text: string) {
    return this.decodeEntities(text).replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').replace(/\s{2,}/g, ' ').trim();
  }

  // ---------- chunking ----------
  private splitIntoChunks(text: string, max = this.MAX_CHUNK): string[] {
    const t = text.trim();
    if (t.length <= max) return [t];
    const parts: string[] = [];
    let rest = t;
    const sentence = /([.!?])\s+/g;

    while (rest.length > max) {
      let cut = -1, m: RegExpExecArray | null;
      sentence.lastIndex = 0;
      while ((m = sentence.exec(rest)) && m.index + m[0].length <= max) cut = m.index + m[0].length;
      if (cut === -1) {
        const space = rest.lastIndexOf(' ', max);
        cut = space > -1 ? space + 1 : max;
      }
      parts.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) parts.push(rest);
    return parts;
  }

  // ---------- providers ----------
  private async viaLibre(text: string, to: string, from: string): Promise<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    const chunks = this.splitIntoChunks(text);
    const out: string[] = [];
    for (const c of chunks) {
      const body = { q: c, source: from, target: to, format: 'text' };
      const res: any = await firstValueFrom(this.http.post(this.libreUrl, body, { headers }));
      out.push(typeof res?.translatedText === 'string' ? res.translatedText : c);
    }
    return this.tidy(out.join(' '));
  }

  private async viaMyMemory(text: string, to: string, from: string): Promise<string> {
    const chunks = this.splitIntoChunks(text);
    const out: string[] = [];
    for (const c of chunks) {
      const params = new HttpParams().set('q', c).set('langpair', `${from}|${to}`);
      const res: any = await firstValueFrom(this.http.get('https://api.mymemory.translated.net/get', { params }));
      out.push(res?.responseData?.translatedText || c);
      await new Promise(r => setTimeout(r, 120)); // respeita rate-limit
    }
    return this.tidy(out.join(' '));
  }

  // ---------- API principal ----------
  /** Traduza SEM usar 'auto'. Ex.: translate(text, 'en', 'pt') */
  async translate(text: string, to: string, from: string): Promise<string> {
    const original = (text || '').trim();
    if (!original) return original;

    const _to = to.toLowerCase();
    const _from = from.toLowerCase();

    const cached = this.read(original, _to, _from);
    if (cached) return cached;

    // 1) LibreTranslate
    try {
      let out = await this.viaLibre(original, _to, _from);
      if (out.length >= Math.floor(this.MIN_RATIO * original.length)) {
        this.write(original, _to, _from, out);
        return out;
      }
      // se ficou curto, tenta MyMemory
    } catch { /* continua no fallback */ }

    // 2) MyMemory
    try {
      let out = await this.viaMyMemory(original, _to, _from);
      if (out.length >= Math.floor(this.MIN_RATIO * original.length)) {
        this.write(original, _to, _from, out);
        return out;
      }
    } catch { /* ignora */ }

    // 3) devolve original como último recurso
    return original;
  }
}
