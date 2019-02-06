export class UnitWords {
  VUNITWORDS!: UnitWord[];
}
export class UnitWord {
  ID = 0;
  LANGID = 0;
  TEXTBOOKID = 0;
  UNIT = 0;
  PART = 0;
  SEQNUM = 0;
  WORD = '';
  NOTE: string | null = null;
  LANGWORDID = 0;

  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
