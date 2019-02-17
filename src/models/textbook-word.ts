export class TextbookWords {
  VTEXTBOOKWORDS!: TextbookWord[];
}
export class TextbookWord {
  TEXTBOOKID = 0;
  LANGID = 0;
  TEXTBOOKNAME = '';
  ENTRYID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  WORDID = 0;
  WORD = '';
  NOTE: string | null = null;
  FAMIID = 0;
  LEVEL = 0;
  UNITS = 0;
  get units(): string[] {
    return Array.from(Array(this.UNITS).keys()).map(value => String(value + 1));
  }
  PARTS = '';
  get parts(): string[] {
    return this.PARTS.split(' ');
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
