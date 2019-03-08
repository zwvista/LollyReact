import { UnitWord } from './unit-word';
import { TextbookWord } from './textbook-word';
import { WordColor } from './word-color';

export class LangWords {
  VLANGWORDS: LangWord[];
  _results = 0;
}
export class LangWord implements WordColor {
  ID = 0;
  LANGID = 0;
  WORD = '';
  NOTE: string | null = null;
  FAMIID = 0;
  LEVEL = 0;
  colorStyle: {string: string} | {} = {};

  constructor() {}

  // https://stackoverflow.com/questions/47540501/typescript-constructor-overloading
  static fromUnit(item: UnitWord): LangWord {
    const o = new LangWord();
    o.ID = item.WORDID;
    o.LANGID = item.LANGID;
    o.WORD = item.WORD;
    o.NOTE = item.NOTE;
    return o;
  }
  static fromTextbook(item: TextbookWord): LangWord {
    const o = new LangWord();
    o.ID = item.WORDID;
    o.LANGID = item.LANGID;
    o.WORD = item.WORD;
    o.NOTE = item.NOTE;
    return o;
  }

  combineNote(note: string | null): boolean {
    const oldNote = this.NOTE;
    if (note) {
      if (!this.NOTE)
        this.NOTE = note;
      else {
        const arr = note.split(',');
        if (!arr.includes(note))
          arr.push(note);
        this.NOTE = arr.join(',');
      }
    }
    return oldNote !== this.NOTE;
  }
}
