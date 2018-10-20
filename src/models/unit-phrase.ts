import { padLeft } from '../common/string';

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
    return padLeft(String(this.UNIT), ' ', 3) +
      padLeft(String(this.PART), ' ', 3) +
      padLeft(String(this.SEQNUM), ' ', 3);
  }
}
