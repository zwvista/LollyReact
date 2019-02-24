import { Inject, Injectable } from 'react.di';
import { TextbookPhraseService } from '../services/textbook-phrase.service';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { TextbookPhrase } from '../models/textbook-phrase';

@Injectable
export class PhrasesTextbookService {

  textbookPhrases: TextbookPhrase[] = [];
  textbookPhraseCount = 0;

  constructor(@Inject private textbookPhraseService: TextbookPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
  }

  getData(page: number, rows: number) {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.textbookPhraseService.getDataByLang(this.settingsService.selectedLang.ID, page, rows)),
      map(res => {
        this.textbookPhrases = res.VTEXTBOOKPHRASES;
        this.textbookPhraseCount = res._results;
      }),
    );
  }
}
