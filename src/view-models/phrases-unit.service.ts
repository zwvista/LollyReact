import { Injectable, Inject } from 'react.di';
import { AppService } from './app.service';
import { SettingsService } from './settings.service';
import { UnitPhrase } from '../models/unit-phrase';
import { UnitPhraseService } from '../services/unit-phrase.service';
import { Observable, EMPTY as empty, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { LangPhraseService } from '../services/lang-phrase.service';
import { LangPhrase } from '../models/lang-phrase';

@Injectable
export class PhrasesUnitService {

  unitPhrases: UnitPhrase[] = new Array(0);

  constructor(@Inject private unitPhraseService: UnitPhraseService,
              @Inject private langPhraseService: LangPhraseService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService) {
  }

  getData() {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.unitPhraseService.getDataByTextbookUnitPart(this.settingsService.USTEXTBOOKID,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO)),
      map(res => this.unitPhrases = res),
    );
  }

  create(item: UnitPhrase): Observable<number | any[]> {
    return this.langPhraseService.getDataByLangPhrase(item.LANGID, item.PHRASE).pipe(
      concatMap( arrLang => {
        if (arrLang.length === 0) {
          const itemLang = LangPhrase.fromUnit(item);
          return this.langPhraseService.create(itemLang);
        } else {
          const itemLang = arrLang[0];
          const langphraseid = itemLang.ID;
          const b = itemLang.combineTranslation(item.TRANSLATION);
          return b ? this.updateTranslation(langphraseid, item.TRANSLATION ? item.TRANSLATION : '').pipe(map(_ => langphraseid)) : of(langphraseid);
        }
      }),
      concatMap(langphraseid => {
        item.LANGPHRASEID = langphraseid as number;
        return this.unitPhraseService.create(item);
      }),
    );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitPhraseService.updateSeqNum(id, seqnum);
  }

  updateTranslation(langphraseid: number, translation: string): Observable<number> {
    return this.langPhraseService.updateTranslation(langphraseid, translation);
  }

  update(item: UnitPhrase): Observable<number> {
    const langphraseid = item.LANGPHRASEID;
    return this.unitPhraseService.getDataByLangPhrase(langphraseid).pipe(
      concatMap(arrUnit => {
        if (arrUnit.length === 0)
          return empty;
        else {
          const itemLang = LangPhrase.fromUnit(item);
          return this.langPhraseService.getDataById(langphraseid).pipe(
            concatMap(arrLangOld => {
              if (arrLangOld.length > 0 && arrLangOld[0].PHRASE === item.PHRASE)
                return this.langPhraseService.updateTranslation(langphraseid, item.TRANSLATION ? item.TRANSLATION : '').pipe(map(_ => langphraseid));
              else
                return this.langPhraseService.getDataByLangPhrase(item.LANGID, item.PHRASE).pipe(
                  concatMap(arrLangNew => {
                    const f = () => {
                      const itemLang = arrLangNew[0];
                      const langphraseid = itemLang.ID;
                      const b = itemLang.combineTranslation(item.TRANSLATION);
                      item.TRANSLATION = itemLang.TRANSLATION;
                      return b ? this.langPhraseService.updateTranslation(langphraseid, item.TRANSLATION ? item.TRANSLATION : '')
                        .pipe(map(_ => langphraseid)) : of(langphraseid);
                    };
                    if (arrUnit.length === 1)
                      if (arrLangNew.length === 0)
                        return this.langPhraseService.update(itemLang).pipe(map(_ => langphraseid));
                      else
                        return this.langPhraseService.delete(langphraseid).pipe(concatMap(_ => f()));
                    else
                    if (arrLangNew.length === 0)
                      return this.langPhraseService.create(itemLang);
                    else
                      return f();
                  }),
                );
            }),
            concatMap(langphraseid => {
              item.LANGPHRASEID = langphraseid as number;
              return this.unitPhraseService.update(item);
            }),
          );
        }
      }),
    );
  }

  delete(id: number): Observable<number> {
    return this.unitPhraseService.delete(id);
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

  newUnitPhrase(): UnitPhrase {
    const o = new UnitPhrase();
    o.TEXTBOOKID = this.settingsService.USTEXTBOOKID;
    const maxElem = this.unitPhrases.length === 0 ? null :
      this.unitPhrases.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    return o;
  }

}
