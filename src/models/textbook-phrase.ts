import { SelectItem } from '../common/selectitem';

export class TextbookPhrases {
  VTEXTBOOKPHRASES!: TextbookPhrase[];
  _results = 0;
}
export class TextbookPhrase {
  TEXTBOOKID = 0;
  LANGID = 0;
  TEXTBOOKNAME = '';
  ID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  PHRASEID = 0;
  PHRASE = '';
  TRANSLATION: string | null = null;

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
