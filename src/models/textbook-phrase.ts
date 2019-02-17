export class TextbookPhrases {
  VTEXTBOOKPHRASES!: TextbookPhrase[];
}
export class TextbookPhrase {
  TEXTBOOKID = 0;
  LANGID = 0;
  TEXTBOOKNAME = '';
  ENTRYID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  PHRASEID = 0;
  PHRASE = '';
  TRANSLATION: string | null = null;
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
