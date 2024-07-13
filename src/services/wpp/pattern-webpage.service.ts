import { BaseService } from '../misc/base.service';
import { MPatternWebPage, MPatternWebPages } from '../../models/wpp/pattern-webpage';
import { singleton } from "tsyringe";

@singleton()
export class PatternWebpageService extends BaseService {

  async getDataByPattern(patternid: number): Promise<MPatternWebPage[]> {
    const url = `${this.baseUrlAPI}VPATTERNSWEBPAGES?PATTERNID=ID,eq,${patternid}&order=SEQNUM`;
    const result = await this.httpGet<MPatternWebPages>(url);
    return result.records.map(value => Object.assign(new MPatternWebPage(), value));
  }

  async getDataById(id: number): Promise<MPatternWebPage[]> {
    const url = `${this.baseUrlAPI}VPATTERNSWEBPAGES?filter=ID,eq,${id}`;
    const result = await this.httpGet<MPatternWebPages>(url);
    return result.records.map(value => Object.assign(new MPatternWebPage(), value));
  }

  async create(item: MPatternWebPage): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}PATTERNSWEBPAGES`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  async updateSeqNum(id: number, seqnum: number): Promise<number> {
    const url = `${this.baseUrlAPI}PATTERNSWEBPAGES/${id}`;
    return await this.httpPut<number>(url, {ID: id, SEQNUM: seqnum} as MPatternWebPage);
  }

  async update(item: MPatternWebPage): Promise<number> {
    const url = `${this.baseUrlAPI}PATTERNSWEBPAGES/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}PATTERNSWEBPAGES/${id}`;
    return await this.httpDelete(url);
  }
}
