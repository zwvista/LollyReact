import { MSelectItem } from '../common/selectitem';
import { MWordColor } from './word-color';
import { MTextbook } from './textbook';

export class MUnitWords {
  VUNITWORDS!: MUnitWord[];
  _results = 0;
}
export class MUnitWord implements MWordColor {
  ID = 0;
  LANGID = 0;
  TEXTBOOKID = 0;
  TEXTBOOKNAME = '';
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  WORD = '';
  NOTE: string | null = null;
  WORDID = 0;
  FAMIID = 0;
  LEVEL = 0;
  colorStyle: {string: string} | {} = {};

  textbook: MTextbook;
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
