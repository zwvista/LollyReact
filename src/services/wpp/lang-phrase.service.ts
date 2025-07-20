import { BaseService } from '../misc/base.service';
import { MLangPhrase, MLangPhrases } from '../../models/wpp/lang-phrase';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';
import { singleton } from 'tsyringe';

@singleton()
export class LangPhraseService extends BaseService {

  async getDataByLang(langid: number, filter: string, filterType: number): Promise<MLangPhrases>;
  async getDataByLang(langid: number, filter: string, filterType: number, page: number, rows: number): Promise<MLangPhrases>;
  async getDataByLang(langid: number, filter: string, filterType: number, page?: number, rows?: number): Promise<MLangPhrases> {
    let url = `${this.baseUrlAPI}LANGPHRASES?filter=LANGID,eq,${langid}&order=PHRASE`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    if (page !== undefined && rows !== undefined)
      url += `&page=${page},${rows}`;
    const result = await this.httpGet<MLangPhrases>(url);
    return ({
      records: result.records.map(value => Object.assign(new MLangPhrase(), value)),
      results: result.results,
    });
  }

  async getDataByLangPhrase(langid: number, phrase: string): Promise<MLangPhrase[]> {
    const url = `${this.baseUrlAPI}LANGPHRASES?filter=LANGID,eq,${langid}&filter=PHRASE,eq,${encodeURIComponent(phrase)}`;
    const result = await this.httpGet<MLangPhrases>(url);
    return result.records.map(value => Object.assign(new MLangPhrase(), value))
        // Api is case insensitive
        .filter(value => value.PHRASE === phrase);
  }

  async getDataById(id: number): Promise<MLangPhrase[]> {
    const url = `${this.baseUrlAPI}LANGPHRASES?filter=ID,eq,${id}`;
    const result = await this.httpGet<MLangPhrases>(url);
    return result.records.map(value => Object.assign(new MLangPhrase(), value));
  }

  async create(item: MLangPhrase): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}LANGPHRASES`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  async update(item: MLangPhrase): Promise<number> {
    const url = `${this.baseUrlAPI}LANGPHRASES/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async updateTranslation(id: number, translation: string): Promise<number> {
    const url = `${this.baseUrlAPI}LANGPHRASES/${id}`;
    return await this.httpPut<number>(url, {ID: id, TRANSLATION: translation} as MLangPhrase);
  }

  async delete(item: MLangPhrase): Promise<string> {
    const url = `${this.baseUrlSP}LANGPHRASES_DELETE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }
}
