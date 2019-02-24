export class TextbookPhrases {
  VTEXTBOOKPHRASES!: TextbookPhrase[];
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
  UNITINFO = '';
  PARTS = '';
  units: string[] = [];
  parts: string[] = [];
  get UNITSTR(): string {
    return this.units[this.UNIT - 1];
  }
  get PARTSTR(): string {
    return this.parts[this.PART - 1];
  }
  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
