import { MUnitWord } from './unit-word';

export class MLangWords {
  records!: MLangWord[];
  results = 0;
}
export class MLangWord {
  ID = 0;
  LANGID = 0;
  WORD = '';
  NOTE = '';
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
}
