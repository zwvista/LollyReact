import { Rxios } from '../../common/rxios';
import { Injectable } from 'react.di';
import {Observable} from "rxjs";

@Injectable
export class BaseService {
  protected readonly baseUrlAPI = 'https://zwvista.tk/lolly/api.php/records/';
  protected readonly baseUrlSP = 'https://zwvista.tk/lolly/sp.php/';
  protected readonly http = new Rxios();

  httpGet<T>(url: string): Observable<T> {
    console.log(`[RestApi]GET:${url}`);
    return this.http.get<T>(url);
  }
}
