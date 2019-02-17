import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { LangWord, LangWords } from '../models/lang-word';
import { map } from 'rxjs/operators';
import { UnitWord } from '../models/unit-word';

@Injectable
export class LangWordService extends BaseService {

  getDataByLang(langid: number): Observable<LangWord[]> {
    const url = `${this.baseUrl}VLANGWORDS?transform=1&filter=LANGID,eq,${langid}&order=WORD`;
    return this.http.get<LangWords>(url)
      .pipe(
        map(result => result.VLANGWORDS.map(value => Object.assign(new LangWord(), value))),
      );
  }

  getDataByLangWord(langid: number, word: string): Observable<LangWord[]> {
    const url = `${this.baseUrl}VLANGWORDS?transform=1&filter[]=LANGID,eq,${langid}&filter[]=WORD,eq,${encodeURIComponent(word)}`;
    return this.http.get<LangWords>(url)
      .pipe(
        map(result => result.VLANGWORDS.map(value => Object.assign(new LangWord(), value))
          // Api is case insensitive
          .filter(value => value.WORD === word)
        ),
      );
  }

  getDataById(id: number): Observable<LangWord[]> {
    const url = `${this.baseUrl}VLANGWORDS?transform=1&filter=ID,eq,${id}`;
    return this.http.get<LangWords>(url)
      .pipe(
        map(result => result.VLANGWORDS.map(value => Object.assign(new LangWord(), value))),
      );
  }

  create(item: LangWord): Observable<number | any[]> {
    const url = `${this.baseUrl}LANGWORDS`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: LangWord): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  updateNote(id: number, note: string): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${id}`;
    return this.http.put<number>(url, {ID: id, NOTE: note} as LangWord).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
