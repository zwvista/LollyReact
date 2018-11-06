import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { LangPhrase, LangPhrases } from '../models/lang-phrase';
import { map } from 'rxjs/operators';

@Injectable
export class LangPhraseService extends BaseService {

  getDataByLang(langid: number): Observable<LangPhrase[]> {
    const url = `${this.baseUrl}LANGPHRASES?transform=1&filter=LANGID,eq,${langid}`;
    return this.http.get<LangPhrases>(url)
      .pipe(
        map(result => result.LANGPHRASES.map(value => Object.assign(new LangPhrase(), value))),
      );
  }

  create(item: LangPhrase): Observable<number | any[]> {
    const url = `${this.baseUrl}LANGPHRASES`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: LangPhrase): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(ID: number): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${ID}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
