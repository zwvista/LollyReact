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

  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
