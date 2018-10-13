import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Textbook, Textbooks } from '../models/textbook';

@Injectable
export class TextbookService extends BaseService {

  getDataByLang(langid: number): Observable<Textbook[]> {
    const url = `${this.baseUrl}TEXTBOOKS?transform=1&filter=LANGID,eq,${langid}`;
    return this.http.get<Textbooks>(url)
      .pipe(
        map(result => result.TEXTBOOKS.map(value => Object.assign(new Textbook(), value))),
      );
  }

}
