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

  urlString(word: string): string {
    const url = this.URL.replace('{0}', encodeURIComponent(word))
      .replace('http://', 'https://');
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
