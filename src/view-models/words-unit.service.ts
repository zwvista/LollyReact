import { Injectable, Inject } from 'react.di';
import { UnitWordService } from '../services/unit-word.service';
import { SettingsService } from './settings.service';
import { UnitWord } from '../models/unit-word';
import { AppService } from './app.service';
import { Observable, EMPTY as empty, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { NoteService } from './note.service';
import { LangWordService } from '../services/lang-word.service';
import { LangWord } from '../models/lang-word';

@Injectable
export class WordsUnitService {

  unitWords: UnitWord[] = new Array(0);
  noteFromIndex = 0;
  noteToIndex = 0;
  noteIfEmpty = true;

  constructor(@Inject private unitWordService: UnitWordService,
              @Inject private langWordService: LangWordService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService,
              @Inject private noteService: NoteService) {
  }

  getData(): Observable<UnitWord[]> {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.unitWordService.getDataByTextbookUnitPart(this.settingsService.USTEXTBOOKID,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO)),
      map(res => this.unitWords = res),
    );
  }

  create(item: UnitWord): Observable<number | any[]> {
    return this.langWordService.getDataByLangWord(item.LANGID, item.WORD).pipe(
      concatMap( arrLang => {
        if (arrLang.length === 0) {
          const itemLang = LangWord.fromUnit(item);
          return this.langWordService.create(itemLang);
        } else {
          const itemLang = arrLang[0];
          const langwordid = itemLang.ID;
          const b = itemLang.combineNote(item.NOTE);
          return b ? this.updateNote(langwordid, item.NOTE ? item.NOTE : '').pipe(map(_ => langwordid)) : of(langwordid);
        }
      }),
      concatMap(langwordid => {
        item.LANGWORDID = langwordid as number;
        return this.unitWordService.create(item);
      }),
    );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitWordService.updateSeqNum(id, seqnum);
  }

  updateNote(langwordid: number, note: string): Observable<number> {
    return this.langWordService.updateNote(langwordid, note);
  }

  update(item: UnitWord): Observable<number> {
    const langwordid = item.LANGWORDID;
    return this.unitWordService.getDataByLangWord(langwordid).pipe(
      concatMap(arrUnit => {
        if (arrUnit.length === 0)
          return empty;
        else {
          const itemLang = LangWord.fromUnit(item);
          return this.langWordService.getDataById(langwordid).pipe(
            concatMap(arrLangOld => {
              if (arrLangOld.length > 0 && arrLangOld[0].WORD === item.WORD)
                return this.langWordService.updateNote(langwordid, item.NOTE ? item.NOTE : '').pipe(map(_ => langwordid));
              else
                return this.langWordService.getDataByLangWord(item.LANGID, item.WORD).pipe(
                  concatMap(arrLangNew => {
                    const f = () => {
                      const itemLang = arrLangNew[0];
                      const langwordid = itemLang.ID;
                      const b = itemLang.combineNote(item.NOTE);
                      item.NOTE = itemLang.NOTE;
                      return b ? this.langWordService.updateNote(langwordid, item.NOTE ? item.NOTE : '')
                        .pipe(map(_ => langwordid)) : of(langwordid);
                    };
                    if (arrUnit.length === 1)
                      if (arrLangNew.length === 0)
                        return this.langWordService.update(itemLang).pipe(map(_ => langwordid));
                      else
                        return this.langWordService.delete(langwordid).pipe(concatMap(_ => f()));
                    else
                    if (arrLangNew.length === 0)
                      return this.langWordService.create(itemLang);
                    else
                      return f();
                  }),
                );
            }),
            concatMap(langwordid => {
              item.LANGWORDID = langwordid as number;
              return this.unitWordService.update(item);
            }),
          );
        }
      }),
    );
  }

  delete(id: number): Observable<number> {
    return this.unitWordService.delete(id);
  }

  reindex(onNext: (index: number) => void) {
    for (let i = 1; i <= this.unitWords.length; i++) {
      const item = this.unitWords[i - 1];
      if (item.SEQNUM === i) continue;
      item.SEQNUM = i;
      this.unitWordService.updateSeqNum(item.ID, item.SEQNUM).subscribe(_ => {
        onNext(i - 1);
      });
    }
  }

  newUnitWord(): UnitWord {
    const o = new UnitWord();
    o.LANGID = this.settingsService.selectedLang.ID;
    o.TEXTBOOKID = this.settingsService.USTEXTBOOKID;
    const maxElem = this.unitWords.length === 0 ? null :
      this.unitWords.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    return o;
  }

  getNote(index: number): Observable<number> {
    const item = this.unitWords[index];
    return this.noteService.getNote(item.WORD).pipe(
      concatMap(note => {
        item.NOTE = note;
        return this.updateNote(item.LANGWORDID, note);
      }),
    );
  }

  getNotes(ifEmpty: boolean, oneComplete: (index: number) => void, allComplete: () => void) {
    this.noteService.getNotes(this.unitWords.length,
      i => !ifEmpty || !this.unitWords[i],
      i => this.getNote(i).subscribe(_ => oneComplete(i)), allComplete);
  }
}
