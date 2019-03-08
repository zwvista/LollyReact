import { SelectItem } from '../common/selectitem';

export class Textbooks {
  TEXTBOOKS!: Textbook[];
}
export class Textbook {
  ID = 0;
  LANGID = 0;
  NAME = '';
  UNITS = '';
  PARTS = '';

  units: SelectItem[] = [];
  parts: SelectItem[] = [];
}
