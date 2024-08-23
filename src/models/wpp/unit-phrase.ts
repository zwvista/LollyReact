import { MTextbook } from '../misc/textbook';

export class MUnitPhrases {
  records!: MUnitPhrase[];
  results = 0;
}
export class MUnitPhrase {
  ID = 0;
  LANGID = 0;
  TEXTBOOKID = 0;
  TEXTBOOKNAME = '';
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  PHRASEID = 0;
  PHRASE = '';
  TRANSLATION = '';
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
}
