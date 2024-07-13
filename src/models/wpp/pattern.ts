export class MPatterns {
  records!: MPattern[];
  results = 0;
}
export class MPattern {
  ID = 0;
  LANGID = 0;
  PATTERN = '';
  NOTE = '';
  TAGS = '';
  IDS_MERGE: string | null = null;
  PATTERNS_SPLIT: string | null = null;
}
