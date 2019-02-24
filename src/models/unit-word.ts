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
  WORDID = 0;
  FAMIID = 0;
  LEVEL = 0;

  UNITSTR(arrUnits: [string]): string {
    return arrUnits[this.UNIT - 1];
  }
  PARTSTR(arrParts: [string]): string {
    return arrParts[this.PART - 1];
  }
  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
