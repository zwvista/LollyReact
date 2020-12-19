import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAutoCorrect, MAutoCorrects } from '../../models/misc/autocorrect';
import { Injectable } from 'react.di';

@Injectable
export class AutoCorrectService extends BaseService {

  getDataByLang(langid: number): Observable<MAutoCorrect[]> {
    const url = `${this.baseUrlAPI}AUTOCORRECT?filter=LANGID,eq,${langid}`;
    return this.http.get<MAutoCorrects>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MAutoCorrect(), value))),
      );
  }
}
