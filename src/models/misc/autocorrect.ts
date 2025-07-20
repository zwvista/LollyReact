export interface MAutoCorrects {
  records: MAutoCorrect[];
}

export class MAutoCorrect {
  ID = 0;
  LANGID = 0;
  SEQNUM = 0;
  INPUT = '';
  EXTENDED = '';
  BASIC = '';
}

export function autoCorrect(text: string, autoCorrects: MAutoCorrect[],
                            colFunc1: (row: MAutoCorrect) => string, colFunc2: (row: MAutoCorrect) => string): string {
  return autoCorrects.reduce((str, row) => str.replace(colFunc1(row), colFunc2(row)), text);
}
