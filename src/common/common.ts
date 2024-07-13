import _ from 'lodash';

// https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
export function googleString(str: string) {
  window.open('https://www.google.com/search?q=' + encodeURIComponent(str), '_blank');
}

export function toParameters(item: Object): Object {
  // @ts-ignore
  return _.mapKeys(item, (v, k) => 'P_' + k);
}

export class GlobalVars {
  public static userid = '';
}
