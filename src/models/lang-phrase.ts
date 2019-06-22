import { MUnitPhrase } from './unit-phrase';

export class MLangPhrases {
  records: MLangPhrase[];
  results = 0;
}
export class MLangPhrase {
  ID = 0;
  LANGID = 0;
  PHRASE = '';
  TRANSLATION: string | null = null;

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
  static fromTextbook(item: MUnitPhrase): MLangPhrase {
    const o = new MLangPhrase();
    o.ID = item.PHRASEID;
    o.LANGID = item.LANGID;
    o.PHRASE = item.PHRASE;
    o.TRANSLATION = item.TRANSLATION;
    return o;
  }

  combineTranslation(translation: string | null): boolean {
    const oldTranslation = this.TRANSLATION;
    if (translation) {
      if (!this.TRANSLATION)
        this.TRANSLATION = translation;
      else {
        const arr = translation.split(',');
        if (!arr.includes(translation))
          arr.push(translation);
        this.TRANSLATION = arr.join(',');
      }
    }
    return oldTranslation !== this.TRANSLATION;
  }
}
