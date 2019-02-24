import { Inject, Injectable } from 'react.di';
import { LangPhraseService } from '../services/lang-phrase.service';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { LangPhrase } from '../models/lang-phrase';
import { Observable } from 'rxjs';

@Injectable
export class PhrasesLangService {

  langPhrases: LangPhrase[] = [];
  langPhraseCount = 0;

  constructor(@Inject private langPhraseService: LangPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
  }

  getData(page: number, rows: number) {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.langPhraseService.getDataByLang(this.settingsService.selectedLang.ID, page, rows)),
      map(res => {
        this.langPhrases = res.LANGPHRASES;
        this.langPhraseCount = res._results;
      }),
    );
  }

  create(item: LangPhrase): Observable<number | any[]> {
    return this.langPhraseService.create(item);
  }

  update(item: LangPhrase): Observable<number> {
    return this.langPhraseService.update(item);
  }

  delete(id: number): Observable<number> {
    return this.langPhraseService.delete(id);
  }

  newLangPhrase(): LangPhrase {
    const o = new LangPhrase();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }
}
