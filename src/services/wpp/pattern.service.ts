import { BaseService } from '../misc/base.service';
import { MPattern, MPatterns } from '../../models/wpp/pattern';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';
import { singleton } from 'tsyringe';

@singleton()
export class PatternService extends BaseService {

  async getDataByLang(langid: number, page: number, rows: number, filter: string, filterType: number): Promise<MPatterns> {
    let url = `${this.baseUrlAPI}PATTERNS?filter=LANGID,eq,${langid}&order=PATTERN&page=${page},${rows}`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'PATTERN' : filterType === 1 ? 'NOTE' : 'TAGS'},cs,${encodeURIComponent(filter)}`;
    const result = await this.httpGet<MPatterns>(url);
    return ({
      records: result.records.map(value => Object.assign(new MPattern(), value)),
      results: result.results,
    });
  }

  async getDataById(id: number): Promise<MPattern[]> {
    const url = `${this.baseUrlAPI}PATTERNS?filter=ID,eq,${id}`;
    const result = await this.httpGet<MPatterns>(url);
    return result.records.map(value => Object.assign(new MPattern(), value));
  }

  async create(item: MPattern): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}PATTERNS`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  async update(item: MPattern): Promise<number> {
    const url = `${this.baseUrlAPI}PATTERNS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}PATTERNS/${id}`;
    return await this.httpDelete(url);
  }

  async mergePatterns(item: MPattern): Promise<string> {
    const url = `${this.baseUrlSP}PATTERNS_MERGE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }

  async splitPattern(item: MPattern): Promise<string> {
    const url = `${this.baseUrlSP}PATTERNS_SPLIT`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }
}
