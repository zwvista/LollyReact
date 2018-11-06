import { Injectable } from 'react.di';
import { LangPhraseService } from '../services/lang-phrase.service';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { LangPhrase } from '../models/lang-phrase';
import { Observable } from 'rxjs';

@Injectable
export class PhrasesLangService {

  langPhrases: LangPhrase[] = new Array(0);

  constructor(private langPhraseService: LangPhraseService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  getData() {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.langPhraseService.getDataByLang(this.settingsService.selectedLang.ID)),
      map(res => this.langPhrases = res),
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
