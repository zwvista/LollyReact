import { MSelectItem } from '../common/selectitem';
import { MWordColor } from './word-color';

export class MUnitWords {
  VUNITWORDS!: MUnitWord[];
}
export class MUnitWord implements MWordColor {
  ID = 0;
  LANGID = 0;
  TEXTBOOKID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  WORD = '';
  NOTE: string | null = null;
  WORDID = 0;
  FAMIID = 0;
  LEVEL = 0;
  colorStyle: {string: string} | {} = {};

  units: MSelectItem[] = [];
  parts: MSelectItem[] = [];
  get UNITSTR(): string {
    return this.units.find(o => o.value === this.UNIT)!.label;
  }
  get PARTSTR(): string {
    return this.parts.find(o => o.value === this.PART)!.label;
  }
  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
