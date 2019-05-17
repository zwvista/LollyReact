import { Injectable } from 'react.di';
import { WordFamiService } from '../services/word-fami.service';
import { MWordFami } from '../models/word-fami';
import { EMPTY as empty, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable
export class WordsFamiService {

  userid = 1;

  constructor(private wordFamiService: WordFamiService) { }

  delete(id: number): Observable<number> {
    return this.wordFamiService.delete(id);
  }

  update(wordid: number, level: number): Observable<number | any> {
    return this.wordFamiService.getDataByUserWord(this.userid, wordid).pipe(
      concatMap(arr => {
        const item = new MWordFami();
        item.USERID = this.userid;
        item.WORDID = wordid;
        item.LEVEL = level;
        if (arr.length === 0) {
          if (level === 0)
            return empty;
          else
            return this.wordFamiService.create(item);
        } else {
          const id = arr[0].ID;
          if (level === 0)
            return this.wordFamiService.delete(id);
          else
            return this.wordFamiService.update(item);
        }
      })
    );
  }


}

