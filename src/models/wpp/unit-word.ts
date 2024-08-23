import { MTextbook } from '../misc/textbook';

export class MUnitWords {
  records!: MUnitWord[];
  results = 0;
}
export class MUnitWord {
  ID = 0;
  LANGID = 0;
  TEXTBOOKID = 0;
  TEXTBOOKNAME = '';
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  WORD = '';
  NOTE = '';
  WORDID = 0;
  FAMIID = 0;
  CORRECT = 0;
  TOTAL = 0;
  isChecked = false;

  textbook!: MTextbook;
  get UNITSTR(): string {
    return this.textbook.UNITSTR(this.UNIT);
  }
  get PARTSTR(): string {
    return this.textbook.PARTSTR(this.PART);
  }
  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
  get ACCURACY(): string {
    return this.TOTAL === 0 ? 'N/A' : `${Math.floor(this.CORRECT / this.TOTAL * 1000) / 10}%`;
  }
}
