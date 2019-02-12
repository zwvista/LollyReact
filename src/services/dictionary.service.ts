import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { DictNote, DictMean, DictsNote, DictsMean } from '../models/dictionary';

@Injectable
export class DictMeanService extends BaseService {

  getDataByLang(langid: number): Observable<DictMean[]> {
    const url = `${this.baseUrl}VDICTSMEAN?transform=1&filter[]=LANGIDFROM,eq,${langid}`;
    return this.http.get<DictsMean>(url)
      .pipe(
        map(result => result.VDICTSMEAN.map(value => Object.assign(new DictMean(), value))),
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
