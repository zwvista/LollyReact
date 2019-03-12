import { Inject, Injectable } from 'react.di';
import { AppService } from './app.service';
import { SettingsService } from './settings.service';
import { MUnitPhrase } from '../models/unit-phrase';
import { UnitPhraseService } from '../services/unit-phrase.service';
import { EMPTY as empty, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { LangPhraseService } from '../services/lang-phrase.service';
import { MLangPhrase } from '../models/lang-phrase';

@Injectable
export class PhrasesUnitService {

  unitPhrases: MUnitPhrase[] = [];

  constructor(@Inject private unitPhraseService: UnitPhraseService,
              @Inject private langPhraseService: LangPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
  }

  getData() {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.unitPhraseService.getDataByTextbookUnitPart(this.settingsService.selectedTextbook,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO)),
      map(res => this.unitPhrases = res),
    );
  }

  create(item: MUnitPhrase): Observable<number | any[]> {
    return this.langPhraseService.getDataByLangPhrase(item.LANGID, item.PHRASE).pipe(
      concatMap( arrLang => {
        if (arrLang.length === 0) {
          const itemLang = MLangPhrase.fromUnit(item);
          return this.langPhraseService.create(itemLang);
        } else {
          const itemLang = arrLang[0];
          const phraseid = itemLang.ID;
          const b = itemLang.combineTranslation(item.TRANSLATION);
          return b ? this.updateTranslation(phraseid, item.TRANSLATION || '').pipe(map(_ => phraseid)) : of(phraseid);
        }
      }),
      concatMap(phraseid => {
        item.PHRASEID = phraseid as number;
        return this.unitPhraseService.create(item);
      }),
    );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitPhraseService.updateSeqNum(id, seqnum);
  }

  updateTranslation(phraseid: number, translation: string): Observable<number> {
    return this.langPhraseService.updateTranslation(phraseid, translation);
  }

  update(item: MUnitPhrase): Observable<number> {
    const phraseid = item.PHRASEID;
    return this.unitPhraseService.getDataByLangPhrase(phraseid).pipe(
      concatMap(arrUnit => {
        if (arrUnit.length === 0)
          return empty;
        else {
          const itemLang = MLangPhrase.fromUnit(item);
          return this.langPhraseService.getDataById(phraseid).pipe(
            concatMap(arrLangOld => {
              if (arrLangOld.length > 0 && arrLangOld[0].PHRASE === item.PHRASE)
                return this.langPhraseService.updateTranslation(phraseid, item.TRANSLATION || '').pipe(map(_ => phraseid));
              else
                return this.langPhraseService.getDataByLangPhrase(item.LANGID, item.PHRASE).pipe(
                  concatMap(arrLangNew => {
                    const f = () => {
                      const itemLang = arrLangNew[0];
                      const phraseid = itemLang.ID;
                      const b = itemLang.combineTranslation(item.TRANSLATION);
                      item.TRANSLATION = itemLang.TRANSLATION;
                      return b ? this.langPhraseService.updateTranslation(phraseid, item.TRANSLATION || '')
                        .pipe(map(_ => phraseid)) : of(phraseid);
                    };
                    if (arrUnit.length === 1)
                      if (arrLangNew.length === 0)
                        return this.langPhraseService.update(itemLang).pipe(map(_ => phraseid));
                      else
                        return this.langPhraseService.delete(phraseid).pipe(concatMap(_ => f()));
                    else
                    if (arrLangNew.length === 0) {
                      itemLang.ID = 0;
                      return this.langPhraseService.create(itemLang);
                    } else
                      return f();
                  }),
                );
            }),
            concatMap(phraseid => {
              item.PHRASEID = phraseid as number;
              return this.unitPhraseService.update(item);
            }),
          );
        }
      }),
    );
  }

  delete(item: MUnitPhrase): Observable<number> {
    return this.unitPhraseService.delete(item.ID).pipe(
      concatMap(_ => this.unitPhraseService.getDataByLangPhrase(item.PHRASEID)),
      concatMap(arr => arr.length !== 0 ? empty : this.langPhraseService.delete(item.PHRASEID)),
    );
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
    o.TEXTBOOKID = this.settingsService.USTEXTBOOKID;
    const maxElem = this.unitPhrases.length === 0 ? null :
      this.unitPhrases.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    o.units = this.settingsService.units;
    o.parts = this.settingsService.parts;
    return o;
  }

}
