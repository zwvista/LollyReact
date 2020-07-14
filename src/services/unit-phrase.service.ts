import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MUnitPhrase, MUnitPhrases } from '../models/unit-phrase';
import { BaseService } from './base.service';
import { MTextbook } from '../models/textbook';

@Injectable
export class UnitPhraseService extends BaseService {

  getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number, filter: string, filterType: number): Observable<MUnitPhrase[]> {
    let url = `${this.baseUrl}VUNITPHRASES?filter=TEXTBOOKID,eq,${textbook.ID}&filter=UNITPART,bt,${unitPartFrom},${unitPartTo}&order=UNITPART&order=SEQNUM`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    return this.http.get<MUnitPhrases>(url)
      .pipe(
        map(result => {
          const result2 = result.records.map(value => Object.assign(new MUnitPhrase(), value));
          result2.forEach(o => o.textbook = textbook);
          return result2;
        }),
      );
  }

  getDataByLang(langid: number, textbooks: MTextbook[], page: number, rows: number, filter: string, filterType: number, textbookFilter: number): Observable<MUnitPhrases> {
    let url = `${this.baseUrl}VUNITPHRASES?filter=LANGID,eq,${langid}&order=TEXTBOOKID&order=UNIT&order=PART&order=SEQNUM&page=${page},${rows}`;
    if (filterType !== 0 && filter)
      url += `&filter=${filterType === 1 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    if (textbookFilter !== 0)
      url += `&filter=TEXTBOOKID,eq,${textbookFilter}`;
    return this.http.get<MUnitPhrases>(url)
      .pipe(
        map(result => ({
          records: result.records.map(value => {
            const v = Object.assign(new MUnitPhrase(), value);
            v.textbook = textbooks.find(o => o.ID === v.TEXTBOOKID);
            return v;
          }),
          results: result.results,
        })),
      );
  }

  getDataByLangPhrase(phraseid: number): Observable<MUnitPhrase[]> {
    const url = `${this.baseUrl}VUNITPHRASES?filter=PHRASEID,eq,${phraseid}`;
    return this.http.get<MUnitPhrases>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MUnitPhrase(), value))),
      );
  }

  create(item: MUnitPhrase): Observable<number | any[]> {
    const url = `${this.baseUrl}UNITPHRASES`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as MUnitPhrase).pipe(
    );
  }

  update(item: MUnitPhrase): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(ID: number): Observable<number> {
    const url = `${this.baseUrl}UNITPHRASES/${ID}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }

}
