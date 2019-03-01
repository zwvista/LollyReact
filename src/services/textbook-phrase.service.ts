import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { TextbookPhrase, TextbookPhrases } from '../models/textbook-phrase';
import { map } from 'rxjs/operators';
import { partsFrom, unitsFrom } from '../common/common';

@Injectable
export class TextbookPhraseService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number): Observable<TextbookPhrases> {
    const url = `${this.baseUrl}VTEXTBOOKPHRASES?transform=1&filter=LANGID,eq,${langid}&order[]=TEXTBOOKID&order[]=UNIT&order[]=PART&order[]=SEQNUM&page=${page},${rows}`;
    return this.http.get<TextbookPhrases>(url)
      .pipe(
        map(result => ({
          VTEXTBOOKPHRASES: result.VTEXTBOOKPHRASES.map(value => {
            const v = Object.assign(new TextbookPhrase(), value);
            v.units = unitsFrom(v.UNITS);
            v.parts = partsFrom(v.PARTS);
            return v;
          }),
          _results: result._results,
        })),
      );
  }
}
