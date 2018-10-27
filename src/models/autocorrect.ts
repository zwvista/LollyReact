export class AutoCorrect {
  ID = 0;
  LANGID = 0;
  SEQNUM = 0;
  INPUT = '';
  EXTENDED = '';
  BASIC = '';
}

export class AutoCorrects {
  AUTOCORRECT: AutoCorrect[];
}

export function autoCorrect(text: string, autoCorrects: AutoCorrect[],
                            colFunc1: (row: AutoCorrect) => string, colFunc2: (row: AutoCorrect) => string): string {
  return autoCorrects.reduce((str, row) => str.replace(colFunc1(row), colFunc2(row)), text);
}
