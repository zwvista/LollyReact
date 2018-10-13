import { Injectable, Inject } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { DictNote, DictOffline, DictOnline, DictsNote, DictsOffline, DictsOnline } from '../models/dictionary';

@Injectable
export class DictOnlineService extends BaseService {

  getDataByLang(langid: number): Observable<DictOnline[]> {
    const url = `${this.baseUrl}VDICTSONLINE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsOnline>(url)
      .pipe(
        map(result => result.VDICTSONLINE.map(value => Object.assign(new DictOnline(), value))),
      );
  }

}

@Injectable
export class DictOfflineService extends BaseService {

  getDataByLang(langid: number): Observable<DictOffline[]> {
    const url = `${this.baseUrl}VDICTSOFFLINE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsOffline>(url)
      .pipe(
        map(result => result.VDICTSOFFLINE.map(value => Object.assign(new DictOffline(), value))),
      );
  }

}

@Injectable
export class DictNoteService extends BaseService {

  getDataByLang(langid: number): Observable<DictNote[]> {
    const url = `${this.baseUrl}VDICTSNOTE?transform=1&filter=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsNote>(url)
      .pipe(
        map(result => result.VDICTSNOTE.map(value => Object.assign(new DictNote(), value))),
      );
  }

}
