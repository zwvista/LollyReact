import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MVoice, MVoices } from '../models/voice';
import { map } from 'rxjs/operators';

@Injectable
export class VoicesService extends BaseService {

  getDataByLang(langid: number): Observable<MVoice[]> {
    const url = `${this.baseUrl}VVOICES?transform=1&filter[]=LANGID,eq,${langid}&filter[]=VOICETYPEID,eq,5`;
    return this.http.get<MVoices>(url)
      .pipe(
        map(result => result.VVOICES.map(value => Object.assign(new MVoice(), value))),
      );
  }
}
