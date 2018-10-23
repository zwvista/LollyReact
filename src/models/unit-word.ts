export class UnitWords {
  VUNITWORDS!: UnitWord[];
}
export class UnitWord {
  ID = 0;
  TEXTBOOKID!: number;
  UNIT!: number;
  PART!: number;
  SEQNUM!: number;
  WORD = '';
  NOTE: string | null = '';

  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
