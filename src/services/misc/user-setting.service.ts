import { BaseService } from './base.service';
import { MUserSetting, MUserSettingInfo, MUserSettings } from '../../models/misc/user-setting';
import { GlobalVars } from '../../common/common';
import { singleton } from 'tsyringe';

@singleton()
export class UserSettingService extends BaseService {

  async getDataByUser(): Promise<MUserSetting[]> {
    const url = `${this.baseUrlAPI}USERSETTINGS?filter=USERID,eq,${GlobalVars.userid}`;
    const result = await this.httpGet<MUserSettings>(url);
    return result.records.map(value => Object.assign(new MUserSetting(), value));
  }

  async updateIntValue(info: MUserSettingInfo, intValue: number): Promise<number> {
    return await this.updateStringValue(info, String(intValue));
  }

  async updateStringValue(info: MUserSettingInfo, stringValue: string): Promise<number> {
    const url = `${this.baseUrlAPI}USERSETTINGS/${info.USERSETTINGID}`;
    const o: any = {};
    o['VALUE' + info.VALUEID] = stringValue;
    return await this.httpPut<number>(url, o as MUserSetting);
  }
}
