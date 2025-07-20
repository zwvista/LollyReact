import { BaseService } from '../misc/base.service';
import { MWordFami, MWordsFami } from '../../models/wpp/word-fami';
import { GlobalVars } from '../../common/common';
import { singleton } from 'tsyringe';

@singleton()
export class WordFamiService extends BaseService {

  async getDataByWord(wordid: number): Promise<MWordFami[]> {
    const url = `${this.baseUrlAPI}WORDSFAMI?filter=USERID,eq,${GlobalVars.userid}&filter=WORDID,eq,${wordid}`;
    const result = await this.httpGet<MWordsFami>(url);
    return result.records.map(value => Object.assign(new MWordFami(), value));
  }

  private async create(item: MWordFami): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}WORDSFAMI`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  private async update(item: MWordFami): Promise<number> {
    const url = `${this.baseUrlAPI}WORDSFAMI/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}WORDSFAMI/${id}`;
    return await this.httpDelete(url);
  }

  async updateWordFami(wordid: number, isCorrect: boolean): Promise<MWordFami> {
    const lst = await this.getDataByWord(wordid);
    const d = isCorrect ? 1 : 0;
    const item = {
      ...new MWordFami(),
      userid: GlobalVars.userid,
      wordid,
    };
    if (!lst.length) {
      item.CORRECT = d
      item.TOTAL = 1
      item.ID = (await this.create(item)) as number;
    }
    else {
      const o = lst[0];
      item.ID = o.ID;
      item.CORRECT = o.CORRECT + d;
      item.TOTAL = o.TOTAL + 1;
      await this.update(item);
    }
    return item
  }
}
