import { Injectable } from 'react.di';
import { MUnitWord, MUnitWords } from '../models/unit-word';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { MTextbook } from '../models/textbook';
import { MSPResult } from '../common/sp-result';
import { toParameters } from '../common/common';

@Injectable
export class UnitWordService extends BaseService {

  getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number, filter: string, filterType: number): Observable<MUnitWord[]> {
    let url = `${this.baseUrlAPI}VUNITWORDS?filter=TEXTBOOKID,eq,${textbook.ID}&filter=UNITPART,bt,${unitPartFrom},${unitPartTo}&order=UNITPART&order=SEQNUM`;
    if (filterType !== 0 && filter)
      url += `&filter=${filterType === 1 ? 'WORD' : 'NOTE'},cs,${encodeURIComponent(filter)}`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => {
          const result2 = result.records.map(value => Object.assign(new MUnitWord(), value));
          result2.forEach(o => o.textbook = textbook);
          return result2;
        }),
      );
  }

  getDataByLang(langid: number, textbooks: MTextbook[], page: number, rows: number, filter: string, filterType: number, textbookFilter: number): Observable<MUnitWords> {
    let url = `${this.baseUrlAPI}VUNITWORDS?filter=LANGID,eq,${langid}&order=TEXTBOOKID&order=UNIT&order=PART&order=SEQNUM&page=${page},${rows}`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'WORD' : 'NOTE'},cs,${encodeURIComponent(filter)}`;
    if (textbookFilter !== 0)
      url += `&filter=TEXTBOOKID,eq,${textbookFilter}`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => {
            const v = Object.assign(new MUnitWord(), value);
            v.textbook = textbooks.find(o => o.ID === v.TEXTBOOKID);
            return v;
          }),
          results: result.results,
        })),
      );
  }

  getDataByLangWord(wordid: number): Observable<MUnitWord[]> {
    const url = `${this.baseUrlAPI}VUNITWORDS?filter=WORDID,eq,${wordid}`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MUnitWord(), value))),
      );
  }

  create(item: MUnitWord): Observable<number | any[]> {
    const url = `${this.baseUrlSP}UNITWORDS_CREATE`;
    return this.http.post<MSPResult[][] | any[]>(url, toParameters(item))
      .pipe(
        map(result => result[0][0].NEW_ID),
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrlAPI}UNITWORDS/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as MUnitWord).pipe(
    );
  }

  update(item: MUnitWord): Observable<string> {
    const url = `${this.baseUrlSP}UNITWORDS_UPDATE`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }

  delete(item: MUnitWord): Observable<string> {
    const url = `${this.baseUrlSP}UNITWORDS_DELETE`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }

}
