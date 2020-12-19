import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MUnitPhrase, MUnitPhrases } from '../../models/wpp/unit-phrase';
import { BaseService } from '../misc/base.service';
import { MTextbook } from '../../models/misc/textbook';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';

@Injectable
export class UnitPhraseService extends BaseService {

  getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number, filter: string, filterType: number): Observable<MUnitPhrase[]> {
    let url = `${this.baseUrlAPI}VUNITPHRASES?filter=TEXTBOOKID,eq,${textbook.ID}&filter=UNITPART,bt,${unitPartFrom},${unitPartTo}&order=UNITPART&order=SEQNUM`;
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
    let url = `${this.baseUrlAPI}VUNITPHRASES?filter=LANGID,eq,${langid}&order=TEXTBOOKID&order=UNIT&order=PART&order=SEQNUM&page=${page},${rows}`;
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
    const url = `${this.baseUrlAPI}VUNITPHRASES?filter=PHRASEID,eq,${phraseid}`;
    return this.http.get<MUnitPhrases>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MUnitPhrase(), value))),
      );
  }

  create(item: MUnitPhrase): Observable<number | any[]> {
    const url = `${this.baseUrlSP}UNITPHRASES_CREATE`;
    return this.http.post<MSPResult[][] | any[]>(url, toParameters(item))
      .pipe(
        map(result => result[0][0].NEW_ID),
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrlAPI}UNITPHRASES/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as MUnitPhrase).pipe(
    );
  }

  update(item: MUnitPhrase): Observable<string> {
    const url = `${this.baseUrlSP}UNITPHRASES_UPDATE`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }

  delete(item: MUnitPhrase): Observable<string> {
    const url = `${this.baseUrlSP}UNITPHRASES_DELETE`;
    return this.http.post<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }

}
