import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MLangPhrase, MLangPhrases } from '../models/lang-phrase';
import { map } from 'rxjs/operators';

@Injectable
export class LangPhraseService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number, filter: string, filterType: number): Observable<MLangPhrases> {
    let url = `${this.baseUrl}LANGPHRASES?filter=LANGID,eq,${langid}&order=PHRASE&page=${page},${rows}`;
    if (filterType !== 0 && filter)
      url += `&filter=${filterType === 1 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    return this.http.get<MLangPhrases>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => Object.assign(new MLangPhrase(), value)),
          results: result.results,
        })),
      );
  }

  getDataByLangPhrase(langid: number, phrase: string): Observable<MLangPhrase[]> {
    const url = `${this.baseUrl}LANGPHRASES?filter=LANGID,eq,${langid}&filter=PHRASE,eq,${encodeURIComponent(phrase)}`;
    return this.http.get<MLangPhrases>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MLangPhrase(), value))
          // Api is case insensitive
          .filter(value => value.PHRASE === phrase)
        ),
      );
  }

  getDataById(id: number): Observable<MLangPhrase[]> {
    const url = `${this.baseUrl}LANGPHRASES?filter=ID,eq,${id}`;
    return this.http.get<MLangPhrases>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MLangPhrase(), value))),
      );
  }

  create(item: MLangPhrase): Observable<number | any[]> {
    const url = `${this.baseUrl}LANGPHRASES`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: MLangPhrase): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  updateTranslation(id: number, translation: string): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${id}`;
    return this.http.put<number>(url, {ID: id, TRANSLATION: translation} as MLangPhrase).pipe(
    );
  }

  delete(ID: number): Observable<number> {
    const url = `${this.baseUrl}LANGPHRASES/${ID}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
