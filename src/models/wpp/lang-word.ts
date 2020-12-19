import { MUnitWord } from './unit-word';

export class MLangWords {
  records: MLangWord[];
  results = 0;
}
export class MLangWord {
  ID = 0;
  LANGID = 0;
  WORD = '';
  NOTE: string | null = null;
  FAMIID = 0;
  CORRECT = 0;
  TOTAL = 0;

  get ACCURACY(): string {
    return this.TOTAL === 0 ? 'N/A' : `${Math.floor(this.CORRECT / this.TOTAL * 1000) / 10}%`;
  }

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
  static fromTextbook(item: MUnitWord): MLangWord {
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
