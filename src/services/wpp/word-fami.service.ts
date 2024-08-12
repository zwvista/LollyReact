import { BaseService } from '../misc/base.service';
import { MWordFami, MWordsFami } from '../../models/wpp/word-fami';
import { GlobalVars } from '../../common/common';
import { singleton } from 'tsyringe';

@singleton()
export class WordFamiService extends BaseService {

  async getDataByUserWord(wordid: number): Promise<MWordFami[]> {
    const url = `${this.baseUrlAPI}WORDSFAMI?filter=USERID,eq,${GlobalVars.userid}&filter=WORDID,eq,${wordid}`;
    const result = await this.httpGet<MWordsFami>(url);
    return result.records.map(value => Object.assign(new MWordFami(), value));
  }

  async create(item: MWordFami): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}WORDSFAMI`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  async update(item: MWordFami): Promise<number> {
    const url = `${this.baseUrlAPI}WORDSFAMI/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}WORDSFAMI/${id}`;
    return await this.httpDelete(url);
  }
}
