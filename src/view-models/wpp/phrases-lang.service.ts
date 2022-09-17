import { injectable } from 'inversify';
import 'reflect-metadata';
import {inject} from "inversify";
import { LangPhraseService } from '../../services/wpp/lang-phrase.service';
import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { concatMap, map } from 'rxjs/operators';
import { MLangPhrase } from '../../models/wpp/lang-phrase';
import { Observable } from 'rxjs';

@injectable()
export class PhrasesLangService {

  langPhrases: MLangPhrase[] = [];
  langPhraseCount = 0;

  constructor(@inject(LangPhraseService) private langPhraseService: LangPhraseService,
              @inject(SettingsService) private settingsService: SettingsService,
              @inject(AppService) private appService: AppService) {
  }

  getData(page: number, rows: number, filter: string, filterType: number) {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.langPhraseService.getDataByLang(this.settingsService.selectedLang.ID, page, rows, filter, filterType)),
      map(res => {
        this.langPhrases = res.records;
        this.langPhraseCount = res.results;
      }),
    );
  }

  create(item: MLangPhrase): Observable<number | any[]> {
    return this.langPhraseService.create(item);
  }

  update(item: MLangPhrase): Observable<number> {
    return this.langPhraseService.update(item);
  }

  delete(item: MLangPhrase): Observable<string> {
    return this.langPhraseService.delete(item);
  }

  newLangPhrase(): MLangPhrase {
    const o = new MLangPhrase();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }
}
