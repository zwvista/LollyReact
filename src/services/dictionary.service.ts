import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { MDictReference, MDictNote, MDictsReference, MDictsNote } from '../models/dictionary';

@Injectable
export class DictReferenceService extends BaseService {

  getDataByLang(langid: number): Observable<MDictReference[]> {
    const url = `${this.baseUrl}VDICTSREFERENCE?transform=1&filter[]=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsReference>(url)
      .pipe(
        map(result => result.VDICTSREFERENCE.map(value => Object.assign(new MDictReference(), value))),
      );
  }

}

@Injectable
export class DictNoteService extends BaseService {

  getDataByLang(langid: number): Observable<MDictNote[]> {
    const url = `${this.baseUrl}VDICTSNOTE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<MDictsNote>(url)
      .pipe(
        map(result => result.VDICTSNOTE.map(value => Object.assign(new MDictNote(), value))),
      );
  }

}
