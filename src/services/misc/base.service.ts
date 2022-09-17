import { Rxios } from '../../common/rxios';
import { injectable } from 'inversify';
import {Observable} from "rxjs";

@injectable()
export class BaseService {
  protected readonly baseUrlAPI = 'https://zwvista2.tk/lolly/api.php/records/';
  protected readonly baseUrlSP = 'https://zwvista2.tk/lolly/sp.php/';
  protected readonly http = new Rxios();

  httpGet<T>(url: string): Observable<T> {
    console.log(`[RestApi]GET:${url}`);
    return this.http.get<T>(url);
  }

  httpPost<T>(url: string, body: any | null): Observable<T> {
    console.log(`[RestApi]POST:${url} BODY:${body}`);
    return this.http.post<T>(url, body);
  }

  httpPut<T>(url: string, body: any | null): Observable<T> {
    console.log(`[RestApi]PUT:${url} BODY:${body}`);
    return this.http.put<T>(url, body);
  }

  httpDelete(url: string): Observable<number> {
    console.log(`[RestApi]DELETE:${url}`);
    return this.http.delete(url) as Observable<number>;
  }
}
