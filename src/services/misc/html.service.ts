import { Injectable } from 'react.di';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable
export class HtmlService extends BaseService {

  static extractTextFrom(html: string, transform: string, template: string,
                         templateHandler: (text: string, template: string) => string): string {
    const dic = new Map([['<delete>', ''], ['\\t', '\t'], ['\\r', '\r'], ['\\n', '\n']]);

    let text = html.replace('\r\n', '\n');
    do {
      if (transform.length === 0) break;
      const arr = transform.split('\r\n');
      if (arr.length % 2 === 1) arr.pop();

      for (let i = 0; i < arr.length; i += 2) {
        const regex = new RegExp(arr[i].replace('\\r\\n', '\\n'), 'gm');
        let replacer = arr[i + 1];
        if (replacer.startsWith('<extract>')) {
          replacer = replacer.substring('<extract>'.length);
          // https://stackoverflow.com/questions/6323417/how-do-i-retrieve-all-matches-for-a-regular-expression-in-javascript
          let s = '', m;
          while (m = regex.exec(text))
            s += m[0];
          text = s;
          if (text.length === 0) break;
        }
        dic.forEach((value, key) => replacer = replacer.replace(key, value));
        text = text.replace(regex, replacer);
      }

      if (template.length === 0) break;
      text = templateHandler(text, template);

    } while (false);
    return text;
  }

  getHtml(url: string): Observable<string> {
    // https://www.concretepage.com/angular-2/angular-httpclient-get-example#Text
    return this.http.get<string>(url, {responseType: 'text'}).pipe(
    );
  }

}
