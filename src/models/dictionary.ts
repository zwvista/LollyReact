import { autoCorrect, AutoCorrect } from './autocorrect';
import { HtmlService } from '../services/html.service';

class Dictionary {
  ID!: number;
  DICTID!: number;
  LANGIDFROM!: number;
  DICTTYPEID!: number;
  DICTTYPENAME!: string;
  DICTNAME!: string;
  URL!: string;
  CHCONV!: string;
  TRANSFORM!: string;
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

export class DictsWord {
  VDICTSWORD!: DictWord[];
}
const cssFolder = 'http://zwvista.tk/lolly/css/';
export class DictWord extends Dictionary {
  htmlString(html: string, word: string): string {
    return HtmlService.extractTextFrom(html, this.TRANSFORM, this.TEMPLATE, (text: string, template2: string) =>
      template2.replace(/\{0\}/g, word).replace(/\{1\}/g, cssFolder).replace(/\{2\}/g, text));
  }
}

export class DictPicker {
  constructor(public DICTID: string, public DICTNAME: string) {}
  dictids(): string[] {
    return this.DICTID.split(',');
  }
}

export class DictsNote {
  VDICTSNOTE!: DictNote[];
}
export class DictNote extends Dictionary {
}
