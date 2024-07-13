import { MSelectItem } from '../../common/selectitem';

export class MTextbooks {
  records!: MTextbook[];
}
export class MTextbook {
  ID = 0;
  LANGID = 0;
  NAME = '';
  UNITS = '';
  PARTS = '';

  units: MSelectItem[] = [];
  parts: MSelectItem[] = [];
  UNITSTR(unit: number): string {
    return this.units.find(o => o.value === unit)!.label;
  }
  PARTSTR(part: number): string {
    return this.parts.find(o => o.value === part)!.label;
  }
}
