import { MUnitWord, MUnitWords } from '../../models/wpp/unit-word';
import { BaseService } from '../misc/base.service';
import { MTextbook } from '../../models/misc/textbook';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';
import { singleton } from "tsyringe";

@singleton()
export class UnitWordService extends BaseService {

  async getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number, filter: string, filterType: number): Promise<MUnitWord[]> {
    let url = `${this.baseUrlAPI}VUNITWORDS?filter=TEXTBOOKID,eq,${textbook.ID}&filter=UNITPART,bt,${unitPartFrom},${unitPartTo}&order=UNITPART&order=SEQNUM`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'WORD' : 'NOTE'},cs,${encodeURIComponent(filter)}`;
    const result = await this.httpGet<MUnitWords>(url);
    const result2 = result.records.map(value => Object.assign(new MUnitWord(), value));
    result2.forEach(o => o.textbook = textbook);
    return result2;
  }

  async getDataByLang(langid: number, textbooks: MTextbook[], page: number, rows: number, filter: string, filterType: number, textbookFilter: number): Promise<MUnitWords> {
    let url = `${this.baseUrlAPI}VUNITWORDS?filter=LANGID,eq,${langid}&order=TEXTBOOKID&order=UNIT&order=PART&order=SEQNUM&page=${page},${rows}`;
    if (filterType !== 0 && filter)
      url += `&filter=${filterType === 1 ? 'WORD' : 'NOTE'},cs,${encodeURIComponent(filter)}`;
    if (textbookFilter !== 0)
      url += `&filter=TEXTBOOKID,eq,${textbookFilter}`;
    const result = await this.httpGet<MUnitWords>(url);
    return ({
      records: result.records.map(value => {
        const v = Object.assign(new MUnitWord(), value);
        v.textbook = textbooks.find(o => o.ID === v.TEXTBOOKID)!;
        return v;
      }),
      results: result.results,
    });
  }

  async getDataByLangWord(wordid: number): Promise<MUnitWord[]> {
    const url = `${this.baseUrlAPI}VUNITWORDS?filter=WORDID,eq,${wordid}`;
    const result = await this.httpGet<MUnitWords>(url);
    return result.records.map(value => Object.assign(new MUnitWord(), value));
  }

  async create(item: MUnitWord): Promise<number | any[]> {
    const url = `${this.baseUrlSP}UNITWORDS_CREATE`;
    const result = await this.httpPost<MSPResult[][] | any[]>(url, toParameters(item));
    return result[0][0].NEW_ID;
  }

  async updateSeqNum(id: number, seqnum: number): Promise<number> {
    const url = `${this.baseUrlAPI}UNITWORDS/${id}`;
    return await this.httpPut<number>(url, {ID: id, SEQNUM: seqnum} as MUnitWord);
  }

  async update(item: MUnitWord): Promise<string> {
    const url = `${this.baseUrlSP}UNITWORDS_UPDATE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }

  async delete(item: MUnitWord): Promise<string> {
    const url = `${this.baseUrlSP}UNITWORDS_DELETE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }

}
