import { injectable } from 'inversify';
import { BaseService } from '../misc/base.service';
import { Observable } from 'rxjs';
import { MLangPhrase, MLangPhrases } from '../../models/wpp/lang-phrase';
import { map } from 'rxjs/operators';
import { toParameters } from '../../common/common';
import { MSPResult } from '../../common/sp-result';

@injectable()
export class LangPhraseService extends BaseService {

  getDataByLang(langid: number, page: number, rows: number, filter: string, filterType: number): Observable<MLangPhrases> {
    let url = `${this.baseUrlAPI}LANGPHRASES?filter=LANGID,eq,${langid}&order=PHRASE&page=${page},${rows}`;
    if (filter)
      url += `&filter=${filterType === 0 ? 'PHRASE' : 'TRANSLATION'},cs,${encodeURIComponent(filter)}`;
    return this.httpGet<MLangPhrases>(url).pipe(
      map(result => ({
        records: result.records.map(value => Object.assign(new MLangPhrase(), value)),
        results: result.results,
      })),
    );
  }

  getDataByLangPhrase(langid: number, phrase: string): Observable<MLangPhrase[]> {
    const url = `${this.baseUrlAPI}LANGPHRASES?filter=LANGID,eq,${langid}&filter=PHRASE,eq,${encodeURIComponent(phrase)}`;
    return this.httpGet<MLangPhrases>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MLangPhrase(), value))
        // Api is case insensitive
        .filter(value => value.PHRASE === phrase)
      ),
    );
  }

  getDataById(id: number): Observable<MLangPhrase[]> {
    const url = `${this.baseUrlAPI}LANGPHRASES?filter=ID,eq,${id}`;
    return this.httpGet<MLangPhrases>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MLangPhrase(), value))),
    );
  }

  create(item: MLangPhrase): Observable<number | any[]> {
    const url = `${this.baseUrlAPI}LANGPHRASES`;
    (item as any).ID = null;
    return this.httpPost<number | any[]>(url, item).pipe(
    );
  }

  update(item: MLangPhrase): Observable<number> {
    const url = `${this.baseUrlAPI}LANGPHRASES/${item.ID}`;
    return this.httpPut<number>(url, item).pipe(
    );
  }

  updateTranslation(id: number, translation: string): Observable<number> {
    const url = `${this.baseUrlAPI}LANGPHRASES/${id}`;
    return this.httpPut<number>(url, {ID: id, TRANSLATION: translation} as MLangPhrase).pipe(
    );
  }

  delete(item: MLangPhrase): Observable<string> {
    const url = `${this.baseUrlSP}LANGPHRASES_DELETE`;
    return this.httpPost<MSPResult[][]>(url, toParameters(item)).pipe(
      map(result => result[0][0].result),
    );
  }
}
