export class TextbookWords {
  VTEXTBOOKWORDS!: TextbookWord[];
  _results = 0;
}
export class TextbookWord {
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
