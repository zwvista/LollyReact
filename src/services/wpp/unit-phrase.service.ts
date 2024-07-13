import { MUnitPhrase, MUnitPhrases } from '../../models/wpp/unit-phrase';
import { BaseService } from '../misc/base.service';
import { MTextbook } from '../../models/misc/textbook';
import { MSPResult } from '../../common/sp-result';
import { toParameters } from '../../common/common';
import { singleton } from "tsyringe";

@singleton()
export class UnitPhraseService extends BaseService {

  async getDataByTextbookUnitPart(textbook: MTextbook, unitPartFrom: number, unitPartTo: number, filter: string, filterType: number): Promise<MUnitPhrase[]> {
    let url = `${this.baseUrlAPI}VUNITPHRASES?filter=TEXTBOOKID,eq,${textbook.ID}&filter=UNITPART,bt,${unitPartFrom},${unitPartTo}&order=UNITPART&order=SEQNUM`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    const result = await this.httpGet<MUnitPhrases>(url);
    const result2 = result.records.map(value => Object.assign(new MUnitPhrase(), value));
    result2.forEach(o => o.textbook = textbook);
    return result2;
  }

  async getDataByLang(langid: number, textbooks: MTextbook[], page: number, rows: number, filter: string, filterType: number, textbookFilter: number): Promise<MUnitPhrases> {
    let url = `${this.baseUrlAPI}VUNITPHRASES?filter=LANGID,eq,${langid}&order=TEXTBOOKID&order=UNIT&order=PART&order=SEQNUM&page=${page},${rows}`;
    if (filterType !== 0 && filter)
      url += `&filter=${filterType === 1 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    if (textbookFilter !== 0)
      url += `&filter=TEXTBOOKID,eq,${textbookFilter}`;
    const result = await this.httpGet<MUnitPhrases>(url);
    return ({
      records: result.records.map(value => {
        const v = Object.assign(new MUnitPhrase(), value);
        v.textbook = textbooks.find(o => o.ID === v.TEXTBOOKID)!;
        return v;
      }),
      results: result.results,
    });
  }

  async getDataByLangPhrase(phraseid: number): Promise<MUnitPhrase[]> {
    const url = `${this.baseUrlAPI}VUNITPHRASES?filter=PHRASEID,eq,${phraseid}`;
    const result = await this.httpGet<MUnitPhrases>(url);
    return result.records.map(value => Object.assign(new MUnitPhrase(), value));
  }

  async create(item: MUnitPhrase): Promise<number | any[]> {
    const url = `${this.baseUrlSP}UNITPHRASES_CREATE`;
    const result = await this.httpPost<MSPResult[][] | any[]>(url, toParameters(item));
    return result[0][0].NEW_ID;
  }

  async updateSeqNum(id: number, seqnum: number): Promise<number> {
    const url = `${this.baseUrlAPI}UNITPHRASES/${id}`;
    return await this.httpPut<number>(url, {ID: id, SEQNUM: seqnum} as MUnitPhrase);
  }

  async update(item: MUnitPhrase): Promise<string> {
    const url = `${this.baseUrlSP}UNITPHRASES_UPDATE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }

  async delete(item: MUnitPhrase): Promise<string> {
    const url = `${this.baseUrlSP}UNITPHRASES_DELETE`;
    const result = await this.httpPost<MSPResult[][]>(url, toParameters(item));
    return result[0][0].result;
  }

}
