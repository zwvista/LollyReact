import { Injectable } from 'react.di';
import { BaseService } from '../misc/base.service';
import { Observable } from 'rxjs';
import { MLangWord, MLangWords } from '../../models/wpp/lang-word';
import { map } from 'rxjs/operators';
import { toParameters } from '../../common/common';
import { MSPResult } from '../../common/sp-result';

@Injectable
export class LangWordService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number, filter: string, filterType: number): Observable<MLangWords> {
    let url = `${this.baseUrlAPI}VLANGWORDS?filter=LANGID,eq,${langid}&order=WORD&page=${page},${rows}`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'WORD' : 'NOTE'},cs,${encodeURIComponent(filter)}`;
    return this.http.get<MLangWords>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => Object.assign(new MLangWord(), value)),
          results: result.results,
        })),
      );
  }

  getDataByLangWord(langid: number, word: string): Observable<MLangWord[]> {
    const url = `${this.baseUrlAPI}VLANGWORDS?filter=LANGID,eq,${langid}&filter=WORD,eq,${encodeURIComponent(word)}`;
    return this.http.get<MLangWords>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MLangWord(), value))
          // Api is case insensitive
          .filter(value => value.WORD === word)
        ),
      );
  }

  getDataById(id: number): Observable<MLangWord[]> {
    const url = `${this.baseUrlAPI}VLANGWORDS?filter=ID,eq,${id}`;
    return this.http.get<MLangWords>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MLangWord(), value))),
      );
  }

  create(item: MLangWord): Observable<number | any[]> {
    const url = `${this.baseUrlAPI}LANGWORDS`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: MLangWord): Observable<number> {
    const url = `${this.baseUrlAPI}LANGWORDS/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  updateNote(id: number, note: string): Observable<number> {
    const url = `${this.baseUrlAPI}LANGWORDS/${id}`;
    return this.http.put<number>(url, {ID: id, NOTE: note} as MLangWord).pipe(
    );
  }

  delete(item: MLangWord): Observable<string> {
    const url = `${this.baseUrlSP}LANGWORDS_DELETE`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }
}
