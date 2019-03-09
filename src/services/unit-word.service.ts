import { Injectable } from 'react.di';
import { MUnitWord, MUnitWords } from '../models/unit-word';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { MTextbook } from '../models/textbook';

@Injectable
export class UnitWordService extends BaseService {

  getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number): Observable<MUnitWord[]> {
    const url = `${this.baseUrl}VUNITWORDS?transform=1&filter[]=TEXTBOOKID,eq,${textbook.ID}&filter[]=UNITPART,bt,${unitPartFrom},${unitPartTo}&order[]=UNITPART&order[]=SEQNUM`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => {
          const result2 = result.VUNITWORDS.map(value => Object.assign(new MUnitWord(), value));
          result2.forEach(o => {
            o.units = textbook.units;
            o.parts = textbook.parts;
          });
          return result2;
        }),
      );
  }

  getDataByLangWord(wordid: number): Observable<MUnitWord[]> {
    const url = `${this.baseUrl}VUNITWORDS?transform=1&filter=WORDID,eq,${wordid}`;
    return this.http.get<MUnitWords>(url)
      .pipe(
        map(result => result.VUNITWORDS.map(value => Object.assign(new MUnitWord(), value))),
      );
  }

  create(item: MUnitWord): Observable<number | any[]> {
    const url = `${this.baseUrl}UNITWORDS`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;
    return this.http.put<number>(url, {ID: id, SEQNUM: seqnum} as MUnitWord).pipe(
    );
  }

  update(item: MUnitWord): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}UNITWORDS/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }

}
