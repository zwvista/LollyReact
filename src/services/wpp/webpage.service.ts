import { Injectable } from 'react.di';
import { BaseService } from '../misc/base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MWebPage, MWebPages } from '../../models/wpp/webpage';

@Injectable
export class WebpageService extends BaseService {

  getDataById(id: number): Observable<MWebPage[]> {
    const url = `${this.baseUrlAPI}WEBPAGES?filter=ID,eq,${id}`;
    return this.http.get<MWebPages>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MWebPage(), value))),
      );
  }

  getDataBySearch(t: string, u: string): Observable<MWebPage[]> {
    let filter = '';
    if (t)
      filter += `?filter=TITLE,cs,${encodeURIComponent(t)}`;
    if (u) {
      filter += filter ? '?' : '&';
      filter += `filter=URL,cs,${encodeURIComponent(u)}`;
    }
    const url = `${this.baseUrlAPI}WEBPAGES${filter}`;
    return this.http.get<MWebPages>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MWebPage(), value))),
      );
  }

  create(item: MWebPage): Observable<number | any[]> {
    const url = `${this.baseUrlAPI}WEBPAGES`;
    (item as any).ID = null;
    return this.http.post<number | any[]>(url, item).pipe(
    );
  }

  update(item: MWebPage): Observable<number> {
    const url = `${this.baseUrlAPI}WEBPAGES/${item.ID}`;
    return this.http.put<number>(url, item).pipe(
    );
  }

  delete(id: number): Observable<number> {
    const url = `${this.baseUrlAPI}WEBPAGES/${id}`;
    return (this.http.delete(url) as Observable<number>).pipe(
    );
  }
}
