import { UserService } from '../../services/misc/user.service';
import { MUser } from '../../models/misc/user';
import { singleton } from 'tsyringe';

@singleton()
export class LoginService {

  item = new MUser();

  constructor(private userService: UserService) {
  }

  async login(): Promise<string> {
    const res = await this.userService.getDataByLang(this.item.USERNAME, this.item.PASSWORD);
    return res.length === 0 ? '' : res[0].USERID;
  }
}
