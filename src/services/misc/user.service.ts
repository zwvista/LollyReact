import { injectable } from 'inversify';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MUser, MUsers } from '../../models/misc/user';
import { map } from 'rxjs/operators';

@injectable()
export class UserService extends BaseService {

  getDataByLang(username: string, password: string): Observable<MUser[]> {
    const url = `${this.baseUrlAPI}USERS?filter=USERNAME,eq,${username}&filter=PASSWORD,eq,${password}`;
    return this.httpGet<MUsers>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MUser(), value))),
    );
  }
}
