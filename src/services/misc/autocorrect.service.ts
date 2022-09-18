import { BaseService } from './base.service';
import { MAutoCorrect, MAutoCorrects } from '../../models/misc/autocorrect';
import { injectable } from 'inversify';

@injectable()
export class AutoCorrectService extends BaseService {

  async getDataByLang(langid: number): Promise<MAutoCorrect[]> {
    const url = `${this.baseUrlAPI}AUTOCORRECT?filter=LANGID,eq,${langid}`;
    const result = await this.httpGet<MAutoCorrects>(url);
    return result.records.map(value => Object.assign(new MAutoCorrect(), value));
  }
}
