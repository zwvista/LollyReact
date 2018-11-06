import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { LangWord, LangWords } from '../models/lang-word';
import { map } from 'rxjs/operators';

@Injectable
export class LangWordService extends BaseService {

  getDataByLang(langid: number): Observable<LangWord[]> {
    const url = `${this.baseUrl}LANGWORDS?transform=1&filter=LANGID,eq,${langid}`;
    return this.http.get<LangWords>(url)
      .pipe(
        map(result => result.LANGWORDS.map(value => Object.assign(new LangWord(), value))),
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

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}LANGWORDS/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
