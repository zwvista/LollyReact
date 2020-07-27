import { Rxios } from '../common/rxios';
import { Injectable } from 'react.di';

@Injectable
export class BaseService {
  protected readonly baseUrlAPI = 'https://zwvista.tk/lolly/api.php/records/';
  protected readonly baseUrlSP = 'https://zwvista.tk/lolly/sp.php/';
  protected readonly http = new Rxios();
}
