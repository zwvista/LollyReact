import { MUnitPhrase } from './unit-phrase';

export class MLangPhrases {
  records!: MLangPhrase[];
  results = 0;
}
export class MLangPhrase {
  ID = 0;
  LANGID = 0;
  PHRASE = '';
  TRANSLATION = '';

  constructor() {}

  // https://stackoverflow.com/questions/47540501/typescript-constructor-overloading
  static fromUnit(item: MUnitPhrase): MLangPhrase {
    const o = new MLangPhrase();
    o.ID = item.PHRASEID;
    o.LANGID = item.LANGID;
    o.PHRASE = item.PHRASE;
    o.TRANSLATION = item.TRANSLATION;
    return o;
  }
}
