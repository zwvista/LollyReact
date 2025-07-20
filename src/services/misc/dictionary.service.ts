import { BaseService } from './base.service';
import { MDictionaries, MDictionary, } from '../../models/misc/dictionary';
import { singleton } from 'tsyringe';

@singleton()
export class DictionaryService extends BaseService {

  async getDictsReference(langid: number): Promise<MDictionary[]> {
    const url = `${this.baseUrlAPI}VDICTSREFERENCE?filter=LANGIDFROM,eq,${langid}&order=SEQNUM&order=DICTNAME`;
    const result = await this.httpGet<MDictionaries>(url);
    return result.records.map(value => Object.assign(new MDictionary(), value));
  }

  async getDictsNote(langid: number): Promise<MDictionary[]> {
    const url = `${this.baseUrlAPI}VDICTSNOTE?filter=LANGIDFROM,eq,${langid}`;
    const result = await this.httpGet<MDictionaries>(url);
    return result.records.map(value => Object.assign(new MDictionary(), value));
  }

  async getDictsTranslation(langid: number): Promise<MDictionary[]> {
    const url = `${this.baseUrlAPI}VDICTSTRANSLATION?filter=LANGIDFROM,eq,${langid}`;
    const result = await this.httpGet<MDictionaries>(url);
    return result.records.map(value => Object.assign(new MDictionary(), value));
  }

}
