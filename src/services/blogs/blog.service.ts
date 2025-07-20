import { SettingsService } from '../../view-models/misc/settings.service';
import _ from "lodash";

export class BlogService {
  private html1With(s: string): string {
    return `<strong><span style="color:#0000ff;">${s}</span></strong>`;
  }
  private htmlWordWith(s: string): string {
    return this.html1With(`${s}：`);
  }
  private htmlBWith(s: string): string {
    return this.html1With(s);
  }
  private htmlE1With(s: string): string {
    return `<span style="color:#006600;">${s}</span>`;
  }
  private html2With(s: string): string {
    return `<span style="color:#cc00cc;">${s}</span>`;
  }
  private htmlE2With(s: string): string {
    return this.html2With(s);
  }
  private htmlIWith(s: string): string {
    return `<strong>${this.html2With(s)}</strong>`;
  }
  private htmlEmptyLine = "<div><br></div>";
  private regMarkedEntry = /(\*\*?)\s*(.*?)：(.*?)：(.*)/g;
  private regMarkedB = /<B>(.+?)<\/B>/g;
  private regMarkedI = /<I>(.+?)<\/I>/g;
  markedToHtml(text: string): string {
    const lst = text.split("\n");
    for (let i = 0; i < lst.length; i++) {
      let s = lst[i];
      const m = this.regMarkedEntry.exec(s)
      if (m) {
        const s1 = m[1];
        const s2 = m[2];
        const s3 = m[3];
        const s4 = m[4];
        s = this.htmlWordWith(s2) + (!s3 ? "" : this.htmlE1With(s3)) + (!s4 ? "" : this.htmlE2With(s4));
        lst[i] = (s1 === "*" ? "<li>" : "<br>") + s;
        if (i === 0 || lst[i - 1].startsWith("<div>"))
          lst.splice(i++, 0, "<ul>");
        const isLast = i == lst.length - 1;
        const m2 = isLast ? null : this.regMarkedEntry.exec(lst[i + 1]);
        if (isLast || m2 == null || m2[1] != "**")
          lst[i] += "</li>";
        if (isLast || m2 == null)
          lst.splice(++i, 0, "</ul>");
      } else if (!s) {
        lst[i] = this.htmlEmptyLine;
      } else {
        s = s.replace(this.regMarkedB, this.htmlBWith("$1"));
        s = s.replace(this.regMarkedI, this.htmlIWith("$1"));
        lst[i] = `<div>${s}</div>`;
      }
    }
    return lst.join("\n");
  }
  private regLine = /<div>(.*?)<\/div>/g;
  private regHtmlB = new RegExp(this.htmlBWith("(.+?)"), "g");
  private regHtmlI = new RegExp(this.htmlIWith("(.+?)"), "g");
  private regHtmlEntry = new RegExp(`(<li>|<br>)${this.htmlWordWith("(.*?)")}(?:${this.htmlE1With("(.*?)")})?(?:${this.htmlE2With("(.*?)")})?(?:</li>)?`, "g");
  htmlToMarked(text: string): string {
    const lst = text.split("\n");
    for (let i = 0; i < lst.length; i++) {
      let s = lst[i]
      if (s === "<!-- wp:html -->" || s === "<!-- /wp:html -->" || s === "<ul>" || s === "</ul>")
        lst.splice(i--, 1)
      else if (s === this.htmlEmptyLine) {
        lst[i] = "";
      } else {
        let m = this.regLine.exec(s);
        if (m != null) {
          s = m[1];
          s = s.replace(this.regHtmlB, "<B>$1</B>");
          s = s.replace(this.regHtmlI, "<I>$1</I>");
          lst[i] = s;
        } else {
          m = this.regHtmlEntry.exec(s);
          if (m != null)
          {
            const s1 = m[1];
            const s2 = m[2];
            const s3 = m[3];
            const s4 = m[4];
            s = (s1 == "<li>" ? "*" : "**") + ` ${s2}：${s3}：${s4}`;
            lst[i] = s;
          }
        }
      }
    }
    return lst.join("\n")
  }
  addTagB(text: string): string {
    return `<B>${text}</B>`;
  }
  addTagI(text: string): string {
    return `<I>${text}</I>`;
  }
  removeTagBI(text: string): string {
    return text.replace(/<\/?\[BI]>/g, "");
  }
  exchangeTagBI(text: string): string
  {
    return text.replace(/<(\/)?B>/g, "<$1Temp>")
      .replace(/<(\/)?I>/g, "<$1B>")
      .replace(/<(\/)?Temp>/g, "<$1I>");
  }
  getExplanation(text: string): string {
    return `* ${text}：：\n`;
  }
  getPatternUrl(patternNo: string): string {
    return `http://viethuong.web.fc2.com/MONDAI/${patternNo}.html`;
  }
  getPatternMarkDown(patternText: string): string {
    return `* [${patternText}　文法](https://www.google.com/search?q=${patternText}　文法)\n* [${patternText}　句型](https://www.google.com/search?q=${patternText}　句型)`;
  }
  private bigDigits = "０１２３４５６７８９";
  addNotes(vmSettings: SettingsService, text: string, allComplete: (arg0: string) => void) {
    const f = (s: string): string => {
      for (let i = 0; i < 10; i++)
        s = s.replace('0' + i, this.bigDigits[i]);
      return s;
    };
    const items = text.split("\n");
    return vmSettings.getNotes(items.length, i => {
      const m = this.regMarkedEntry.exec(items[i]);
      if (!m) return false;
      const word = m[2];
      return word.split('').every(ch => ch != '（' && !this.bigDigits.includes(ch));
    }, async i => {
      const m = this.regMarkedEntry.exec(items[i])!;
      const s1 = m[1];
      const word = m[2];
      const s3 = m[3];
      const s4 = m[4];
      const note = await vmSettings.getNote(word);
      const j = _.findIndex(note, ch => _.isNumber(ch));
      const s21 = j === -1 ? note : note.substring(0, j);
      const s22 = j === -1 ? "" : f(note.substring(j));
      const s2 = word + (s21 == word || !s21 ? "" : `（${s21}）`) + s22;
      items[i] = `${s1} ${s2}：${s3}：${s4}`;
    }, () => allComplete(items.join("\n")));
  }
}
