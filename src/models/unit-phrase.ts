import { SelectItem } from '../common/selectitem';

export class UnitPhrases {
  VUNITPHRASES!: UnitPhrase[];
}
export class UnitPhrase {
  ID = 0;
  LANGID = 0;
  TEXTBOOKID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  PHRASEID = 0;
  PHRASE = '';
  TRANSLATION: string | null = null;
  UNITS = '';
  PARTS = '';

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
