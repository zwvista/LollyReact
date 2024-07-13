import { BaseService } from './base.service';
import { MLanguage, MLanguages } from '../../models/misc/language';
import { singleton } from "tsyringe";

@singleton()
export class LanguageService extends BaseService {

  async getData(): Promise<MLanguage[]> {
    const url = `${this.baseUrlAPI}LANGUAGES?filter=ID,neq,0`;
    const result = await this.httpGet<MLanguages>(url);
    // https://stackoverflow.com/questions/5873624/parse-json-string-into-a-particular-object-prototype-in-javascript
    return result.records.map(value => Object.assign(new MLanguage(), value));
  }
}
