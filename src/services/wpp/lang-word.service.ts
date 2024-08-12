import { BaseService } from '../misc/base.service';
import { MLangWord, MLangWords } from '../../models/wpp/lang-word';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';
import { singleton } from 'tsyringe';

@singleton()
export class LangWordService extends BaseService {

  async getDataByLang(langid: number, page: number, rows: number, filter: string, filterType: number): Promise<MLangWords> {
    let url = `${this.baseUrlAPI}VLANGWORDS?filter=LANGID,eq,${langid}&order=WORD&page=${page},${rows}`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'WORD' : 'NOTE'},cs,${encodeURIComponent(filter)}`;
    const result = await this.httpGet<MLangWords>(url);
    return ({
      records: result.records.map(value => Object.assign(new MLangWord(), value)),
      results: result.results,
    });
  }

  async getDataByLangWord(langid: number, word: string): Promise<MLangWord[]> {
    const url = `${this.baseUrlAPI}VLANGWORDS?filter=LANGID,eq,${langid}&filter=WORD,eq,${encodeURIComponent(word)}`;
    const result = await this.httpGet<MLangWords>(url);
    return result.records.map(value => Object.assign(new MLangWord(), value))
        // Api is case insensitive
        .filter(value => value.WORD === word);
  }

  async getDataById(id: number): Promise<MLangWord[]> {
    const url = `${this.baseUrlAPI}VLANGWORDS?filter=ID,eq,${id}`;
    const result = await this.httpGet<MLangWords>(url);
    return result.records.map(value => Object.assign(new MLangWord(), value));
  }

  async create(item: MLangWord): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}LANGWORDS`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  async update(item: MLangWord): Promise<number> {
    const url = `${this.baseUrlAPI}LANGWORDS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async updateNote(id: number, note: string): Promise<number> {
    const url = `${this.baseUrlAPI}LANGWORDS/${id}`;
    return await this.httpPut<number>(url, {ID: id, NOTE: note} as MLangWord);
  }

  async delete(item: MLangWord): Promise<string> {
    const url = `${this.baseUrlSP}LANGWORDS_DELETE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }
}
