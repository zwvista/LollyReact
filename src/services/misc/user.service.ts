import { BaseService } from './base.service';
import { MUser, MUsers } from '../../models/misc/user';
import { singleton } from "tsyringe";

@singleton()
export class UserService extends BaseService {

  async getDataByLang(username: string, password: string): Promise<MUser[]> {
    const url = `${this.baseUrlAPI}USERS?filter=USERNAME,eq,${username}&filter=PASSWORD,eq,${password}`;
    const result = await this.httpGet<MUsers>(url);
    return result.records.map(value => Object.assign(new MUser(), value));
  }
}
