import { SelectItem } from '../common/selectitem';
import { WordColor } from './word-color';

export class TextbookWords {
  VTEXTBOOKWORDS!: TextbookWord[];
  _results = 0;
}
export class TextbookWord implements WordColor {
  TEXTBOOKID = 0;
  LANGID = 0;
  TEXTBOOKNAME = '';
  ID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  WORDID = 0;
  WORD = '';
  NOTE: string | null = null;
  FAMIID = 0;
  LEVEL = 0;
  UNITS = '';
  PARTS = '';
  colorStyle: {string: string} | {} = {};

  units: SelectItem[] = [];
  parts: SelectItem[] = [];
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
