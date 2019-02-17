import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { TextbookPhrase, TextbookPhrases } from '../models/textbook-phrase';
import { map } from 'rxjs/operators';

@Injectable
export class TextbookPhraseService extends BaseService {

  getDataByLang(langid: number): Observable<TextbookPhrase[]> {
    const url = `${this.baseUrl}VTEXTBOOKWORDS?transform=1&filter=LANGID,eq,${langid}&order[]=UNIT&order[]=PART&order[]=SEQNUM`;
    return this.http.get<TextbookPhrases>(url)
      .pipe(
        map(result => result.VTEXTBOOKPHRASES.map(value => Object.assign(new TextbookPhrase(), value))),
      );
  }
}
