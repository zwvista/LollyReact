import { injectable } from 'inversify';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MUser, MUsers } from '../../models/misc/user';
import { map } from 'rxjs/operators';

@injectable()
export class UserService extends BaseService {

  async getDataByLang(username: string, password: string): Promise<MUser[]> {
    const url = `${this.baseUrlAPI}USERS?filter=USERNAME,eq,${username}&filter=PASSWORD,eq,${password}`;
    const result = await this.httpGet<MUsers>(url);
    return result.records.map(value => Object.assign(new MUser(), value));
  }
}
