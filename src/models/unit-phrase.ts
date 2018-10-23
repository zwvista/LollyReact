export class UnitPhrases {
  VUNITPHRASES!: UnitPhrase[];
}
export class UnitPhrase {
  ID = 0;
  TEXTBOOKID!: number;
  UNIT!: number;
  PART!: number;
  SEQNUM!: number;
  PHRASE!: string;
  TRANSLATION!: string;

  get unitPartSeqnum(): string {
    return String(this.UNIT).padStart(3) +
      String(this.PART).padStart(3) +
      String(this.SEQNUM).padStart(3);
  }
}
