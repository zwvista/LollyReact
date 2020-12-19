import { Injectable } from 'react.di';
import { BaseService } from '../misc/base.service';
import { Observable } from 'rxjs';
import { MPattern, MPatterns } from '../../models/wpp/pattern';
import { map } from 'rxjs/operators';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';

@Injectable
export class PatternService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number, filter: string, filterType: number): Observable<MPatterns> {
    let url = `${this.baseUrlAPI}PATTERNS?filter=LANGID,eq,${langid}&order=PATTERN&page=${page},${rows}`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'PATTERN' : filterType === 1 ? 'NOTE' : 'TAGS'},cs,${encodeURIComponent(filter)}`;
    return this.http.get<MPatterns>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => Object.assign(new MPattern(), value)),
          results: result.results,
        })),
      );
  }

  getDataById(id: number): Observable<MPattern[]> {
    const url = `${this.baseUrlAPI}PATTERNS?filter=ID,eq,${id}`;
    return this.http.get<MPatterns>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MPattern(), value))),
      );
  }

  create(item: MPattern): Observable<number | any[]> {
    const url = `${this.baseUrlAPI}PATTERNS`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item).pipe(
    );
  }

  update(item: MPattern): Observable<number> {
    const url = `${this.baseUrlAPI}PATTERNS/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrlAPI}PATTERNS/${id}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }

  mergePatterns(item: MPattern): Observable<string> {
    const url = `${this.baseUrlSP}PATTERNS_MERGE`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }

  splitPattern(item: MPattern): Observable<string> {
    const url = `${this.baseUrlSP}PATTERNS_SPLIT`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }
}
