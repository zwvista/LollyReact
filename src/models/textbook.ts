import { MSelectItem } from '../common/selectitem';

export class MTextbooks {
  TEXTBOOKS!: MTextbook[];
}
export class MTextbook {
  ID = 0;
  LANGID = 0;
  NAME = '';
  UNITS = '';
  PARTS = '';

  units: MSelectItem[] = [];
  parts: MSelectItem[] = [];
}
