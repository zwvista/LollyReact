import { Inject, Injectable } from 'react.di';
import { AppService } from './app.service';
import { SettingsService } from './settings.service';
import { MUnitPhrase } from '../models/wpp/unit-phrase';
import { UnitPhraseService } from '../services/wpp/unit-phrase.service';
import { EMPTY as empty, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { LangPhraseService } from '../services/wpp/lang-phrase.service';
import { MLangPhrase } from '../models/wpp/lang-phrase';

@Injectable
export class PhrasesUnitService {

  unitPhrases: MUnitPhrase[] = [];

  textbookPhrases: MUnitPhrase[] = [];
  textbookPhraseCount = 0;

  constructor(@Inject private unitPhraseService: UnitPhraseService,
              @Inject private langPhraseService: LangPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
  }

  getDataInTextbook(filter: string, filterType: number) {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.unitPhraseService.getDataByTextbookUnitPart(this.settingsService.selectedTextbook,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO, filter, filterType)),
      map(res => this.unitPhrases = res),
    );
  }

  getDataInLang(page: number, rows: number, filter: string, filterType: number, textbookFilter: number) {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.unitPhraseService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, page, rows, filter, filterType, textbookFilter)),
      map(res => {
        this.textbookPhrases = res.records;
        this.textbookPhraseCount = res.results;
      }),
    );
  }

  create(item: MUnitPhrase): Observable<number | any[]> {
    return this.unitPhraseService.create(item);
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitPhraseService.updateSeqNum(id, seqnum);
  }

  updateTranslation(phraseid: number, translation: string): Observable<number> {
    return this.langPhraseService.updateTranslation(phraseid, translation);
  }

  update(item: MUnitPhrase): Observable<string> {
    return this.unitPhraseService.update(item);
  }

  delete(item: MUnitPhrase): Observable<string> {
    return this.unitPhraseService.delete(item);
  }

  reindex(onNext: (index: number) => void) {
    for (let i = 1; i <= this.unitPhrases.length; i++) {
      const item = this.unitPhrases[i - 1];
      if (item.SEQNUM === i) continue;
      item.SEQNUM = i;
      this.unitPhraseService.updateSeqNum(item.ID, item.SEQNUM).subscribe(_ => {
        onNext(i - 1);
      });
    }
  }

  newUnitPhrase(): MUnitPhrase {
    const o = new MUnitPhrase();
    o.LANGID = this.settingsService.selectedLang.ID;
    o.TEXTBOOKID = this.settingsService.USTEXTBOOK;
    const maxElem = this.unitPhrases.length === 0 ? null :
      this.unitPhrases.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    o.textbook = this.settingsService.selectedTextbook;
    return o;
  }

}
