import { Inject, Injectable } from 'react.di';
import { SettingsService } from './settings.service';
import { AppService } from './app.service';
import { TextbookWordService } from '../services/textbook-word.service';
import { Observable } from 'rxjs';
import { TextbookWord } from '../models/textbook-word';
import { concatMap, map } from 'rxjs/operators';
import { NoteService } from './note.service';
import { LangWordService } from '../services/lang-word.service';

@Injectable
export class WordsTextbookService {

  textbookWords: TextbookWord[] = [];
  textbookWordCount = 0;

  constructor(@Inject private textbookWordService: TextbookWordService,
              @Inject private langWordService: LangWordService,
              @Inject private settingsService: SettingsService,
              @Inject private appService: AppService,
              @Inject private noteService: NoteService) {
  }

  getData(page: number, rows: number) {
    return this.appService.initializeComplete.pipe(
      concatMap(_ => this.textbookWordService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, page, rows)),
      map(res => {
        this.textbookWords = res.VTEXTBOOKWORDS;
        this.textbookWordCount = res._results
      }),
    );
  }

  updateNote(id: number, note: string): Observable<number> {
    return this.langWordService.updateNote(id, note);
  }

  getNote(index: number): Observable<number> {
    const item = this.textbookWords[index];
    return this.noteService.getNote(item.WORD).pipe(
      concatMap(note => {
        item.NOTE = note;
        return this.updateNote(item.WORDID, note);
      }),
    );
  }
}
