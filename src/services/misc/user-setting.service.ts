import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MUserSetting, MUserSettingInfo, MUserSettings } from '../../models/misc/user-setting';

@Injectable
export class UserSettingService extends BaseService {

  getDataByUser(userid: number): Observable<MUserSetting[]> {
    const url = `${this.baseUrlAPI}USERSETTINGS?filter=USERID,eq,${userid}`;
    return this.http.get<MUserSettings>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MUserSetting(), value))),
      );
  }

  updateIntValue(info: MUserSettingInfo, intValue: number): Observable<number> {
    return this.updateStringValue(info, String(intValue));
  }

  updateStringValue(info: MUserSettingInfo, stringValue: string): Observable<number> {
    const url = `${this.baseUrlAPI}USERSETTINGS/${info.USERSETTINGID}`;
    const o = {};
    o['VALUE' + info.VALUEID] = stringValue;
    return this.http.put<number>(url, o as MUserSetting).pipe(
    );
  }
}
