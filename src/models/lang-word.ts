import { UnitWord } from './unit-word';

export class LangWords {
  LANGWORDS: LangWord[];
}
export class LangWord {
  ID = 0;
  LANGID = 0;
  WORD = '';
  LEVEL = 0;
  NOTE: string | null = null;

  constructor() {}

  // https://stackoverflow.com/questions/47540501/typescript-constructor-overloading
  static fromUnit(item: UnitWord): LangWord {
    const o = new LangWord();
    o.ID = item.LANGWORDID;
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
