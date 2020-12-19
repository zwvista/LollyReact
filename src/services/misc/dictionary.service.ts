import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import {
  MDictionary,
  MDictionaries,
} from '../../models/misc/dictionary';

@Injectable
export class DictionaryService extends BaseService {

  getDictsReference(langid: number): Observable<MDictionary[]> {
    const url = `${this.baseUrlAPI}VDICTSREFERENCE?filter=LANGIDFROM,eq,${langid}&order=SEQNUM&order=DICTNAME`;
    return this.http.get<MDictionaries>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictionary(), value))),
      );
  }

  getDictsNote(langid: number): Observable<MDictionary[]> {
    const url = `${this.baseUrlAPI}VDICTSNOTE?filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictionaries>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictionary(), value))),
      );
  }

  getDictsTranslation(langid: number): Observable<MDictionary[]> {
    const url = `${this.baseUrlAPI}VDICTSTRANSLATION?filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictionaries>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictionary(), value))),
      );
  }

}
