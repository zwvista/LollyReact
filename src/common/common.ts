// https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
export function googleString(str: string) {
  window.open('https://www.google.com/search?q=' + encodeURIComponent(str), '_blank');
}

export function unitsFrom(info: string): string[] {
  let m = /UNITS,(\d+)/g.exec(info);
  if (m) {
    const units = +m[1];
    return Array.from(Array(units).keys()).map(value => String(value + 1));
  }
  m = /PAGES,(\d+),(\d+)/g.exec(info);
  if (m) {
    const n1 = +m[1], n2 = +m[2];
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    const units = (n1 + n2 - 1) / n2 >> 0;
    return Array.from(Array(units).keys()).map(value => `${value * n2 + 1}~${value * n2 + n2}`);
  }
  m = /CUSTOM,(.+)/g.exec(info);
  if (m)
    return m[1].split(',');
  return [];
}

export function partsFrom(parts: string): string[] {
  return parts.split(' ');
}
