import { padLeft } from '../common/string';

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
    return padLeft(String(this.UNIT), ' ', 3) +
      padLeft(String(this.PART), ' ', 3) +
      padLeft(String(this.SEQNUM), ' ', 3);
  }
}
