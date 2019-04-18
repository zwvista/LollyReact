import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MUserSetting, MUserSettings } from '../models/user-setting';

@Injectable
export class UserSettingService extends BaseService {

  getDataByUser(userid: number): Observable<MUserSetting[]> {
    const url = `${this.baseUrl}USERSETTINGS?transform=1&filter=USERID,eq,${userid}`;
    return this.http.get<MUserSettings>(url)
      .pipe(
        map(result => result.USERSETTINGS.map(value => Object.assign(new MUserSetting(), value))),
      );
  }

  updateLang(id: number, langid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE1: String(langid)} as MUserSetting).pipe(
    );
  }

  updateTextbook(id: number, textbookid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE1: String(textbookid)} as MUserSetting).pipe(
    );
  }

  updateDictItem(id: number, dictitem: string): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE2: dictitem} as MUserSetting).pipe(
    );
  }

  updateDictNote(id: number, dictnoteid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE3: String(dictnoteid)} as MUserSetting).pipe(
    );
  }

  updateDictTranslation(id: number, dicttranslationid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE1: String(dicttranslationid)} as MUserSetting).pipe(
    );
  }

  updateUnitFrom(id: number, unitfrom: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE1: String(unitfrom)} as MUserSetting).pipe(
    );
  }

  updatePartFrom(id: number, partfrom: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE2: String(partfrom)} as MUserSetting).pipe(
    );
  }

  updateUnitTo(id: number, unitto: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE3: String(unitto)} as MUserSetting).pipe(
    );
  }

  updatePartTo(id: number, partto: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE4: String(partto)} as MUserSetting).pipe(
    );
  }

  updateVoice(id: number, voiceid: number): Observable<number> {
    const url = `${this.baseUrl}USERSETTINGS/${id}`;
    return this.http.put<number>(url, {VALUE1: String(voiceid)} as MUserSetting).pipe(
    );
  }
}
