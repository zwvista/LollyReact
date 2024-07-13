import { autoCorrect, MAutoCorrect } from './autocorrect';
import { HtmlService } from '../../services/misc/html.service';

export class MDictionary {
  ID = 0;
  DICTID = 0;
  LANGIDFROM = 0;
  DICTTYPECODE = 0;
  DICTTYPENAME = '';
  NAME = '';
  URL = '';
  CHCONV = '';
  TRANSFORM = '';
  WAIT = 0;
  TEMPLATE = '';

  urlString(word: string, autoCorrects: MAutoCorrect[]): string {
    const word2 =
      this.CHCONV === 'BASIC' ? autoCorrect(word, autoCorrects, row => row.EXTENDED, row => row.BASIC) : word;
    const url = this.URL.replace('{0}', encodeURIComponent(word2));
    console.log(url);
    return url;
  }

  htmlString(html: string, word: string): string {
    return HtmlService.extractTextFrom(html, this.TRANSFORM, this.TEMPLATE, (text, template2) =>
      template2.replace(/\{0\}/g, word).replace(/\{1\}/g, cssFolder).replace(/\{2\}/g, text));
  }
}

export class MDictionaries {
  records!: MDictionary[];
}

const cssFolder = 'http://zwvista.com/lolly/css/';
