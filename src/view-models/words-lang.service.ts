import { Injectable } from 'react.di';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { LangWordService } from '../services/lang-word.service';
import { Observable } from 'rxjs';
import { LangWord } from '../models/lang-word';
import { concatMap, map } from 'rxjs/operators';

@Injectable
export class WordsLangService {

  langWords: LangWord[] = new Array(0);

  constructor(private langWordService: LangWordService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  getData(): Observable<LangWord[]> {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.langWordService.getDataByLang(this.settingsService.selectedLang.ID)),
      map(res => this.langWords = res),
    );
  }

  create(item: LangWord): Observable<number | any[]> {
    return this.langWordService.create(item);
  }

  update(item: LangWord): Observable<number> {
    return this.langWordService.update(item);
  }

  delete(id: number): Observable<number> {
    return this.langWordService.delete(id);
  }

  newLangWord(): LangWord {
    const o = new LangWord();
    o.LANGID = this.settingsService.selectedLang.ID;
    o.LEVEL = 0;
    return o;
  }
}
