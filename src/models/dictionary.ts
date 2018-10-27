import { autoCorrect, AutoCorrect } from './autocorrect';

class Dictionary {
  ID!: number;
  LANGIDFROM!: number;
  DICTTYPENAME!: string;
  DICTNAME!: string;
  URL!: string;
  CHCONV!: string;
  TRANSFORM_MAC!: string;
  WAIT!: number;
  TEMPLATE!: string;

  urlString(word: string, autoCorrects: AutoCorrect[]): string {
    const word2 =
      this.CHCONV === 'BASIC' ? autoCorrect(word, autoCorrects, row => row.EXTENDED, row => row.BASIC) :
        encodeURIComponent(word);
    const url = this.URL.replace('{0}', word2);
    console.log(url);
    return url;
  }
}

export class DictsOnline {
  VDICTSONLINE!: DictOnline[];
}
export class DictOnline extends Dictionary {

}
export class DictsOffline {
  VDICTSOFFLINE!: DictOffline[];
}
export class DictOffline extends Dictionary {

}
export class DictsNote {
  VDICTSNOTE!: DictNote[];
}
export class DictNote extends Dictionary {
}
