import { map, mergeMap } from 'rxjs/operators';
import { Inject, Injectable } from 'react.di';
import { LanguageService } from '../services/language.service';
import { UserSettingService } from '../services/user-setting.service';
import { UserSetting } from '../models/user-setting';
import { Language } from '../models/language';
import { DictItem, DictMean, DictNote } from '../models/dictionary';
import { Textbook } from '../models/textbook';
import { forkJoin, Observable } from 'rxjs';
import { DictMeanService, DictNoteService } from '../services/dictionary.service';
import { TextbookService } from '../services/textbook.service';
import { AutoCorrectService } from '../services/autocorrect.service';
import { autoCorrect, AutoCorrect } from '../models/autocorrect';
import * as _ from 'lodash';
import { partsFrom, unitsFrom } from '../common/common';
import { SelectItem } from '../common/selectitem';
import { WordColor } from '../models/word-color';

const userid = 1;

@Injectable
export class SettingsService {

  userSettings: UserSetting[] = [];
  private selectedUSUser0!: UserSetting;
  private selectedUSUser1!: UserSetting;
  private get USLANGID(): number {
    return +this.selectedUSUser0.VALUE1;
  }
  private set USLANGID(newValue: number) {
    this.selectedUSUser0.VALUE1 = String(newValue);
  }
  get USROWSPERPAGEOPTIONS(): number[] {
    return this.selectedUSUser0.VALUE2.split(',').map(value => +value);
  }
  get USROWSPERPAGE(): number {
    return +this.selectedUSUser0.VALUE3;
  }
  USLEVELCOLORS!: {number: [string]} | {};
  private selectedUSLang!: UserSetting;
  get USTEXTBOOKID(): number {
    return +this.selectedUSLang.VALUE1;
  }
  set USTEXTBOOKID(newValue: number) {
    this.selectedUSLang.VALUE1 = String(newValue);
  }
  get USDICTITEM(): string {
    return this.selectedUSLang.VALUE2;
  }
  set USDICTITEM(newValue: string) {
    this.selectedUSLang.VALUE2 = newValue;
  }
  get USDICTNOTEID(): number {
    return +this.selectedUSLang.VALUE3;
  }
  set USDICTNOTEID(newValue: number) {
    this.selectedUSLang.VALUE3 = String(newValue);
  }
  get USDICTITEMS(): string {
    return this.selectedUSLang.VALUE4 || '0';
  }
  set USDICTITEMS(newValue: string) {
    this.selectedUSLang.VALUE4 = newValue;
  }
  private selectedUSTextbook!: UserSetting;
  get USUNITFROM(): number {
    return +this.selectedUSTextbook.VALUE1;
  }
  set USUNITFROM(newValue: number) {
    this.selectedUSTextbook.VALUE1 = String(newValue);
  }
  get USPARTFROM(): number {
    return +this.selectedUSTextbook.VALUE2;
  }
  set USPARTFROM(newValue: number) {
    this.selectedUSTextbook.VALUE2 = String(newValue);
  }
  get USUNITTO(): number {
    return +this.selectedUSTextbook.VALUE3;
  }
  set USUNITTO(newValue: number) {
    this.selectedUSTextbook.VALUE3 = String(newValue);
  }
  get USPARTTO(): number {
    return +this.selectedUSTextbook.VALUE4;
  }
  set USPARTTO(newValue: number) {
    this.selectedUSTextbook.VALUE4 = String(newValue);
  }
  get USUNITPARTFROM(): number {
    return this.USUNITFROM * 10 + this.USPARTFROM;
  }
  get USUNITPARTTO(): number {
    return this.USUNITTO * 10 + this.USPARTTO;
  }
  get isSingleUnitPart(): boolean {
    return this.USUNITPARTFROM === this.USUNITPARTTO;
  }
  get isSingleUnit(): boolean {
    return this.USUNITFROM === this.USUNITTO && this.USPARTFROM === 1 && this.USPARTTO === this.partCount;
  }
  get isInvalidUnitPart(): boolean {
    return this.USUNITPARTFROM > this.USUNITPARTTO;
  }

  languages: Language[] = [];
  selectedLang!: Language;

  dictsMean: DictMean[] = [];
  dictItems: DictItem[] = [];
  _selectedDictItem!: DictItem;
  get selectedDictItem(): DictItem {
    return this._selectedDictItem;
  }
  set selectedDictItem(newValue: DictItem) {
    this._selectedDictItem = newValue;
    this.USDICTITEM = this._selectedDictItem.DICTID;
  }

  dictsNote: DictNote[] = [];
  _selectedDictNote: DictNote | null = null;
  get selectedDictNote(): DictNote | null {
    return this._selectedDictNote;
  }
  set selectedDictNote(newValue: DictNote | null) {
    this._selectedDictNote = newValue;
    if (newValue) this.USDICTNOTEID = newValue.ID;
  }
  get hasNote(): boolean {
    return this.dictsNote.length !== 0;
  }

  textbooks: Textbook[] = [];
  private _selectedTextbook: Textbook;
  get selectedTextbook(): Textbook {
    return this._selectedTextbook;
  }
  set selectedTextbook(newValue: Textbook) {
    this._selectedTextbook = newValue;
    this.setSelectedTextbook();
  }

  units: SelectItem[] = [];
  get unitCount(): number {
    return this.units.length;
  }
  parts: SelectItem[] = [];
  get partCount(): number {
    return this.parts.length;
  }
  get isSinglePart(): boolean {
    return this.partCount === 1;
  }

  autoCorrects: AutoCorrect[] = [];

  constructor(@Inject private langService: LanguageService,
              @Inject private userSettingService: UserSettingService,
              @Inject private dictMeanService: DictMeanService,
              @Inject private dictNoteService: DictNoteService,
              @Inject private textbookService: TextbookService,
              private autoCorrectService: AutoCorrectService) { }

  getData(): Observable<void> {
    return forkJoin([this.langService.getData(), this.userSettingService.getDataByUser(userid)]).pipe(
      mergeMap(res => {
        this.languages = res[0] as Language[];
        this.userSettings = res[1] as UserSetting[];
        this.selectedUSUser0 = this.userSettings.find(value => value.KIND === 1 && value.ENTITYID === 0);
        this.selectedUSUser1 = this.userSettings.find(value => value.KIND === 1 && value.ENTITYID === 1);
        this.USLEVELCOLORS = {};
        this.selectedUSUser0.VALUE4.split('\r\n').map(v => v.split(','))
          .forEach(v => this.USLEVELCOLORS[+v[0]] = [v[1], v[2]]);
        return this.setSelectedLang(this.languages.find(value => value.ID === this.USLANGID)!);
      }));
  }

  setSelectedLang(lang: Language): Observable<void> {
    this.selectedLang = lang;
    this.USLANGID = this.selectedLang.ID;
    this.selectedUSLang = this.userSettings.find(value => value.KIND === 2 && value.ENTITYID === this.USLANGID)!;
    const dicts = this.USDICTITEMS.split('\r\n');
    return forkJoin([
      this.dictMeanService.getDataByLang(this.USLANGID),
      this.dictNoteService.getDataByLang(this.USLANGID),
      this.textbookService.getDataByLang(this.USLANGID),
      this.autoCorrectService.getDataByLang(this.USLANGID)]).pipe(
      map(res => {
        this.dictsMean = res[0] as DictMean[];
        let i = 0;
        this.dictItems = _.flatMap(dicts, d => {
          if (d === '0')
            return _.map(this.dictsMean, d2 => new DictItem(String(d2.DICTID), d2.DICTNAME));
          else {
            i++;
            return [new DictItem(d, `Custom${i}`)];
          }
        });
        this.selectedDictItem = this.dictItems.find(value => value.DICTID === this.USDICTITEM)!;
        this.dictsNote = res[1] as DictNote[];
        this.selectedDictNote = !this.hasNote ? null : this.dictsNote.find(value => value.ID === this.USDICTNOTEID)!;
        this.textbooks = res[2] as Textbook[];
        this.selectedTextbook = this.textbooks.find(value => value.ID === this.USTEXTBOOKID)!;
        this.autoCorrects = res[3] as AutoCorrect[];
      }));
  }

  private setSelectedTextbook() {
    this.USTEXTBOOKID = this.selectedTextbook.ID;
    this.selectedUSTextbook = this.userSettings.find(value => value.KIND === 3 && value.ENTITYID === this.USTEXTBOOKID)!;
    this.units = unitsFrom(this.selectedTextbook.UNITS);
    this.parts = partsFrom(this.selectedTextbook.PARTS);
  }

  dictHtml(word: string, dictids: string[]): string {
    let s = '<html><body>\n';
    dictids.forEach((dictid, i) => {
      const item = this.dictsMean.find(v => String(v.DICTID) === dictid);
      const ifrId = `ifr${i + 1}`;
      const url = item.urlString(word, this.autoCorrects);
      s += `<iframe id='$ifrId' frameborder='1' style='width:100%; height:500px; display:block' src='$url'></iframe>\n`;
    });
    s += '</body></html>\\n';
    return s;
  }

  updateLang(): Observable<number> {
    return this.userSettingService.updateLang(this.selectedUSUser0.ID, this.USLANGID);
  }

  updateTextbook(): Observable<number> {
    return this.userSettingService.updateTextbook(this.selectedUSLang.ID, this.USTEXTBOOKID);
  }

  updateDictItem(): Observable<number> {
    return this.userSettingService.updateDictItem(this.selectedUSLang.ID, this.USDICTITEM);
  }

  updateDictNote(): Observable<number> {
    return this.userSettingService.updateDictNote(this.selectedUSLang.ID, this.USDICTNOTEID);
  }

  updateUnitFrom(): Observable<number> {
    return this.userSettingService.updateUnitFrom(this.selectedUSTextbook.ID, this.USUNITFROM);
  }

  updatePartFrom(): Observable<number> {
    return this.userSettingService.updatePartFrom(this.selectedUSTextbook.ID, this.USPARTFROM);
  }

  updateUnitTo(): Observable<number> {
    return this.userSettingService.updateUnitTo(this.selectedUSTextbook.ID, this.USUNITTO);
  }

  updatePartTo(): Observable<number> {
    return this.userSettingService.updatePartTo(this.selectedUSTextbook.ID, this.USPARTTO);
  }

  autoCorrectInput(text: string): string {
    return autoCorrect(text, this.autoCorrects, row => row.INPUT, row => row.EXTENDED);
  }

  setColorStyle(words: WordColor[]) {
    words.forEach(v => v.colorStyle = v.LEVEL === 0 ? {} : {
      'background-color': '#' + this.USLEVELCOLORS[v.LEVEL][0],
      'color': '#' + this.USLEVELCOLORS[v.LEVEL][1],
    });
  }
}
