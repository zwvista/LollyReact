import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MTextbookPhrase, MTextbookPhrases } from '../models/textbook-phrase';
import { map } from 'rxjs/operators';
import { MTextbook } from '../models/textbook';

@Injectable
export class TextbookPhraseService extends BaseService {

  getDataByLang(langid: number, textbooks: MTextbook[], page: number, rows: number): Observable<MTextbookPhrases> {
    const url = `${this.baseUrl}VTEXTBOOKPHRASES?transform=1&filter=LANGID,eq,${langid}&order[]=TEXTBOOKID&order[]=UNIT&order[]=PART&order[]=SEQNUM&page=${page},${rows}`;
    return this.http.get<MTextbookPhrases>(url)
      .pipe(
        map(result => ({
          VTEXTBOOKPHRASES: result.VTEXTBOOKPHRASES.map(value => {
            const v = Object.assign(new MTextbookPhrase(), value);
            const v2 = textbooks.find(o => o.ID === v.TEXTBOOKID);
            v.units = v2.units;
            v.parts = v2.parts;
            return v;
          }),
          _results: result._results,
        })),
      );
  }
}
