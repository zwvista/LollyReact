import { Inject, Injectable } from 'react.di';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { concatMap, map } from 'rxjs/operators';
import { UnitPhraseService } from '../services/unit-phrase.service';
import { MUnitPhrase } from '../models/unit-phrase';

@Injectable
export class PhrasesTextbookService {

  textbookPhrases: MUnitPhrase[] = [];
  textbookPhraseCount = 0;

  constructor(@Inject private unitPhraseService: UnitPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
  }

  getData(page: number, rows: number) {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.unitPhraseService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, page, rows)),
      map(res => {
        this.textbookPhrases = res.VUNITPHRASES;
        this.textbookPhraseCount = res._results;
      }),
    );
  }
}
