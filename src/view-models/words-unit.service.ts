import { Inject, Injectable } from 'react.di';
import { UnitWordService } from '../services/unit-word.service';
import { SettingsService } from './settings.service';
import { MUnitWord } from '../models/unit-word';
import { AppService } from './app.service';
import { EMPTY as empty, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { NoteService } from './note.service';
import { LangWordService } from '../services/lang-word.service';
import { MLangWord } from '../models/lang-word';
import { WordsFamiService } from './words-fami.service';

@Injectable
export class WordsUnitService {

  unitWords: MUnitWord[] = [];

  textbookWords: MUnitWord[] = [];
  textbookWordCount = 0;

  constructor(@Inject private unitWordService: UnitWordService,
              @Inject private langWordService: LangWordService,
              @Inject private wordsFamiService: WordsFamiService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService,
              @Inject private noteService: NoteService) {
  }

  getDataInTextbook(filter: string, filterType: number): Observable<void> {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.unitWordService.getDataByTextbookUnitPart(this.settingsService.selectedTextbook,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO, filter, filterType)),
      map(res => {
        this.settingsService.setColorStyles(res);
        this.unitWords = res
      }),
    );
  }

  getDataInLang(page: number, rows: number, filter: string, filterType: number, textbookFilter: number) {
    return this.appService.initializeObject.pipe(
      concatMap(_ => this.unitWordService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, page, rows, filter, filterType, textbookFilter)),
      map(res => {
        this.settingsService.setColorStyles(res.records);
        this.textbookWords = res.records;
        this.textbookWordCount = res.results
      }),
    );
  }

  create(item: MUnitWord): Observable<number | any[]> {
    return this.langWordService.getDataByLangWord(item.LANGID, item.WORD).pipe(
      concatMap( arrLang => {
        if (arrLang.length === 0) {
          const itemLang = MLangWord.fromUnit(item);
          return this.langWordService.create(itemLang);
        } else {
          const itemLang = arrLang[0];
          const wordid = itemLang.ID;
          const b = itemLang.combineNote(item.NOTE);
          return b ? this.updateNote(wordid, item.NOTE || '').pipe(map(_ => wordid)) : of(wordid);
        }
      }),
      concatMap(wordid => {
        item.WORDID = wordid as number;
        return this.unitWordService.create(item);
      }),
    );
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitWordService.updateSeqNum(id, seqnum);
  }

  updateNote(wordid: number, note: string): Observable<number> {
    return this.langWordService.updateNote(wordid, note);
  }

  update(item: MUnitWord): Observable<number> {
    const wordid = item.WORDID;
    return this.unitWordService.getDataByLangWord(wordid).pipe(
      concatMap(arrUnit => {
        if (arrUnit.length === 0)
          return empty;
        else {
          const itemLang = MLangWord.fromUnit(item);
          return this.langWordService.getDataById(wordid).pipe(
            concatMap(arrLangOld => {
              if (arrLangOld.length > 0 && arrLangOld[0].WORD === item.WORD)
                return this.langWordService.updateNote(wordid, item.NOTE || '').pipe(map(_ => wordid));
              else
                return this.langWordService.getDataByLangWord(item.LANGID, item.WORD).pipe(
                  concatMap(arrLangNew => {
                    const f = () => {
                      const itemLang = arrLangNew[0];
                      const wordid = itemLang.ID;
                      const b = itemLang.combineNote(item.NOTE);
                      item.NOTE = itemLang.NOTE;
                      return b ? this.langWordService.updateNote(wordid, item.NOTE || '')
                        .pipe(map(_ => wordid)) : of(wordid);
                    };
                    if (arrUnit.length === 1)
                      if (arrLangNew.length === 0)
                        return this.langWordService.update(itemLang).pipe(map(_ => wordid));
                      else
                        return this.langWordService.delete(wordid).pipe(concatMap(_ => f()));
                    else
                    if (arrLangNew.length === 0) {
                      itemLang.ID = 0;
                      return this.langWordService.create(itemLang);
                    } else
                      return f();
                  }),
                );
            }),
            concatMap(wordid => {
              item.WORDID = wordid as number;
              return this.unitWordService.update(item);
            }),
          );
        }
      }),
    );
  }

  delete(item: MUnitWord): Observable<number> {
    return this.unitWordService.delete(item.ID).pipe(
      concatMap(_ => this.langWordService.delete(item.WORDID)),
      concatMap(_ => this.wordsFamiService.delete(item.FAMIID)),
    );
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

  newUnitWord(): MUnitWord {
    const o = new MUnitWord();
    o.LANGID = this.settingsService.selectedLang.ID;
    o.TEXTBOOKID = this.settingsService.USTEXTBOOKID;
    const maxElem = this.unitWords.length === 0 ? null :
      this.unitWords.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    o.textbook = this.settingsService.selectedTextbook;
    return o;
  }

  getNote(index: number): Observable<number> {
    const item = this.unitWords[index];
    return this.noteService.getNote(item.WORD).pipe(
      concatMap(note => {
        item.NOTE = note;
        return this.updateNote(item.WORDID, note);
      }),
    );
  }

  getNotes(ifEmpty: boolean, oneComplete: (index: number) => void, allComplete: () => void) {
    this.noteService.getNotes(this.unitWords.length,
      i => !ifEmpty || !this.unitWords[i],
      i => this.getNote(i).subscribe(_ => oneComplete(i)), allComplete);
  }
}
