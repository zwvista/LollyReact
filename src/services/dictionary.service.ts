import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import {
  MDictionary,
  MDictsReference,
  MDictsNote,
  MDictsTranslation
} from '../models/dictionary';

@Injectable
export class DictionaryService extends BaseService {

  getDictsReference(langid: number): Observable<MDictionary[]> {
    const url = `${this.baseUrl}VDICTSREFERENCE?filter=LANGIDFROM,eq,${langid}&order=SEQNUM&order=DICTNAME`;
    return this.http.get<MDictsReference>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictionary(), value))),
      );
  }

  getDictsNote(langid: number): Observable<MDictionary[]> {
    const url = `${this.baseUrl}VDICTSNOTE?filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsNote>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictionary(), value))),
      );
  }

  getDictsTranslation(langid: number): Observable<MDictionary[]> {
    const url = `${this.baseUrl}VDICTSTRANSLATION?filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsTranslation>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MDictionary(), value))),
      );
  }

}
