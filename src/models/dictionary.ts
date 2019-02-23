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
      this.CHCONV === 'BASIC' ? autoCorrect(word, autoCorrects, row => row.EXTENDED, row => row.BASIC) : word;
    const url = this.URL.replace('{0}', encodeURIComponent(word2));
    console.log(url);
    return url;
  }
}

export class DictsMean {
  VDICTSMEAN!: DictMean[];
}
const cssFolder = 'http://zwvista.tk/lolly/css/';
export class DictMean extends Dictionary {
  htmlString(html: string, word: string): string {
    return HtmlService.extractTextFrom(html, this.TRANSFORM, this.TEMPLATE, (text: string, template2: string) =>
      template2.replace(/\{0\}/g, word).replace(/\{1\}/g, cssFolder).replace(/\{2\}/g, text));
  }
}

export class DictItem {
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
