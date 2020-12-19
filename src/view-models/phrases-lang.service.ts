import { Inject, Injectable } from 'react.di';
import { LangPhraseService } from '../services/wpp/lang-phrase.service';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { MLangPhrase } from '../models/wpp/lang-phrase';
import { Observable } from 'rxjs';

@Injectable
export class PhrasesLangService {

  langPhrases: MLangPhrase[] = [];
  langPhraseCount = 0;

  constructor(@Inject private langPhraseService: LangPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
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
