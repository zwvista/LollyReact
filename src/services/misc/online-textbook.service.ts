import { BaseService } from './base.service';
import { singleton } from 'tsyringe';
import { MOnlineTextbook, MOnlineTextbooks } from '../../models/misc/online-textbook';

@singleton()
export class OnlineTextbookService extends BaseService {

  async getDataByLang(langid: number): Promise<MOnlineTextbook[]> {
    const url = `${this.baseUrlAPI}VONLINETEXTBOOKS?filter=LANGID,eq,${langid}`;
    const result = await this.httpGet<MOnlineTextbooks>(url);
    return result.records.map(value => Object.assign(new MOnlineTextbook(), value));
  }
}
