import { padLeft } from '../common/string';

export class UnitWords {
  VUNITWORDS!: UnitWord[];
}
export class UnitWord {
  ID!: number;
  TEXTBOOKID!: number;
  UNIT!: number;
  PART!: number;
  SEQNUM!: number;
  WORD!: string;
  NOTE!: string;

  get unitPartSeqnum(): string {
    return padLeft(String(this.UNIT), ' ', 3) +
      padLeft(String(this.PART), ' ', 3) +
      padLeft(String(this.SEQNUM), ' ', 3);
  }
}
