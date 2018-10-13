import { Injectable, Inject } from 'react.di';
import { UnitWordService } from '../services/unit-word.service';
import { SettingsService } from './settings.service';
import { UnitWord } from '../models/unit-word';
import { AppService } from './app.service';
import { Observable ,  EMPTY as empty } from 'rxjs';
import { HtmlService } from '../services/html.service';
import { mergeMap } from 'rxjs/operators';

@Injectable
export class WordsUnitService {

  unitWords: UnitWord[] = new Array(0);
  noteFromIndex = 0;
  noteToIndex = 0;
  noteIfEmpty = true;

  constructor(@Inject private unitWordService: UnitWordService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService,
              @Inject private htmlService: HtmlService) {
    appService.initializeComplete.subscribe(_ => this.getData());
  }

  getData() {
    if (this.appService.isInitialized) {
      this.unitWordService.getDataByTextbookUnitPart(this.settingsService.USTEXTBOOKID,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO)
        .subscribe(res => this.unitWords = res);
    }
  }

  create(item: UnitWord): Observable<number | any[]> {
    return this.unitWordService.create(item);
  }

  updateSeqNum(id: number, seqnum: number): Observable<number> {
    return this.unitWordService.updateSeqNum(id, seqnum);
  }

  updateNote(id: number, note: string): Observable<number> {
    return this.unitWordService.updateNote(id, note);
  }

  update(item: UnitWord): Observable<number> {
    return this.unitWordService.update(item);
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
    o.TEXTBOOKID = this.settingsService.USTEXTBOOKID;
    const maxElem = this.unitWords.length === 0 ? null :
      this.unitWords.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    return o;
  }

  getNote(index: number): Observable<number> {
    const dictNote = this.settingsService.selectedDictNote;
    if (!dictNote) return empty;
    const item = this.unitWords[index];
    console.log(dictNote);
    const url = dictNote.urlString(item.WORD);
    return this.htmlService.getHtml(url).pipe(
      mergeMap(html => {
        console.log(html);
        item.NOTE = HtmlService.extractTextFrom(html, dictNote.TRANSFORM_MAC, '', (text, _) => text);
        return this.unitWordService.updateNote(item.ID, item.NOTE);
      }));
  }

  getNotes(ifEmpty: boolean, complete: (number: number) => void) {
    const dictNote = this.settingsService.selectedDictNote;
    if (!dictNote) return;
    this.noteFromIndex = 0;
    this.noteToIndex = this.unitWords.length;
    this.noteIfEmpty = ifEmpty;
    complete(dictNote.WAIT);
  }

  getNextNote(rowComplete: (number: number) => void, allComplete: () => void) {
    if (this.noteIfEmpty)
      while (this.noteFromIndex < this.noteToIndex && this.unitWords[this.noteFromIndex].NOTE)
        this.noteFromIndex++;
    if (this.noteFromIndex >= this.noteToIndex)
      allComplete();
    else {
      const i = this.noteFromIndex;
      this.getNote(i).subscribe(() => {
        rowComplete(i);
      });
      this.noteFromIndex++;
    }
  }
}
