import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TextbookWord, TextbookWords } from '../models/textbook-word';
import { partsFrom, unitsFrom } from '../common/common';

@Injectable
export class TextbookWordService extends BaseService {

  getDataByLang(langid: number): Observable<TextbookWord[]> {
    const url = `${this.baseUrl}VTEXTBOOKWORDS?transform=1&filter=LANGID,eq,${langid}&order[]=TEXTBOOKID&order[]=UNIT&order[]=PART&order[]=SEQNUM`;
    return this.http.get<TextbookWords>(url)
      .pipe(
        map(result => result.VTEXTBOOKWORDS.map(value => {
          const v = Object.assign(new TextbookWord(), value);
          v.units = unitsFrom(v.UNITINFO);
          v.parts = partsFrom(v.PARTS);
          return v;
        })),
      );
  }
}
