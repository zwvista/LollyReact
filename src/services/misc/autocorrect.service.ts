import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAutoCorrect, MAutoCorrects } from '../../models/misc/autocorrect';
import { injectable } from 'inversify';

@injectable()
export class AutoCorrectService extends BaseService {

  getDataByLang(langid: number): Observable<MAutoCorrect[]> {
    const url = `${this.baseUrlAPI}AUTOCORRECT?filter=LANGID,eq,${langid}`;
    return this.httpGet<MAutoCorrects>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MAutoCorrect(), value))),
    );
  }
}
