import { MUnitWord } from './unit-word';
import { MTextbookWord } from './textbook-word';
import { MWordColor } from './word-color';

export class MLangWords {
  VLANGWORDS: MLangWord[];
  _results = 0;
}
export class MLangWord implements MWordColor {
  ID = 0;
  LANGID = 0;
  WORD = '';
  NOTE: string | null = null;
  FAMIID = 0;
  LEVEL = 0;
  colorStyle: {string: string} | {} = {};

  constructor() {}

  // https://stackoverflow.com/questions/47540501/typescript-constructor-overloading
  static fromUnit(item: MUnitWord): MLangWord {
    const o = new MLangWord();
    o.ID = item.WORDID;
    o.LANGID = item.LANGID;
    o.WORD = item.WORD;
    o.NOTE = item.NOTE;
    return o;
  }
  static fromTextbook(item: MTextbookWord): MLangWord {
    const o = new MLangWord();
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
