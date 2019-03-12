import { Injectable } from 'react.di';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { MWordFami, MWordsFami } from '../models/word-fami';

@Injectable
export class WordFamiService extends BaseService {

  getDataByUserWord(userid: number, wordid: number): Observable<MWordFami[]> {
    const url = `${this.baseUrl}WORDSFAMI?transform=1&filter[]=USERID,eq,${userid}&filter[]=WORDID,eq,${wordid}`;
    return this.http.get<MWordsFami>(url)
      .pipe(
        map(result => result.WORDSFAMI.map(value => Object.assign(new MWordFami(), value))),
      );
  }

  create(item: MWordFami): Observable<number | any[]> {
    const url = `${this.baseUrl}WORDSFAMI`;
    return this.http.post<number | any[]>(url, item)
      .pipe(
      );
  }

  update(item: MWordFami): Observable<number> {
    const url = `${this.baseUrl}WORDSFAMI/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrl}WORDSFAMI/${id}`;

    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}