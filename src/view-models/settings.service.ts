import { map, mergeMap } from 'rxjs/operators';
import { Inject, Injectable } from 'react.di';
import { LanguageService } from '../services/language.service';
import { UserSettingService } from '../services/user-setting.service';
import { MUserSetting } from '../models/user-setting';
import { MLanguage } from '../models/language';
import { MDictItem, MDictMean, MDictNote } from '../models/dictionary';
import { MTextbook } from '../models/textbook';
import { EMPTY as empty, forkJoin, Observable } from 'rxjs';
import { DictMeanService, DictNoteService } from '../services/dictionary.service';
import { TextbookService } from '../services/textbook.service';
import { AutoCorrectService } from '../services/autocorrect.service';
import { autoCorrect, MAutoCorrect } from '../models/autocorrect';
import * as _ from 'lodash';
import { MSelectItem } from '../common/selectitem';
import { MWordColor } from '../models/word-color';
import * as Speech from 'speak-tts';
import { VoicesService } from '../services/voices.service';
import { MVoice } from '../models/voice';
import { WordsFamiService } from './words-fami.service';

const userid = 1;

@Injectable
export class SettingsService {

  userSettings: MUserSetting[] = [];
  private selectedUSUser0!: MUserSetting;
  private selectedUSUser1!: MUserSetting;
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
  private selectedUSLang2!: MUserSetting;
  get USTEXTBOOKID(): number {
    return +this.selectedUSLang2.VALUE1;
  }
  set USTEXTBOOKID(newValue: number) {
    this.selectedUSLang2.VALUE1 = String(newValue);
  }
  get USDICTITEM(): string {
    return this.selectedUSLang2.VALUE2;
  }
  set USDICTITEM(newValue: string) {
    this.selectedUSLang2.VALUE2 = newValue;
  }
  get USDICTNOTEID(): number {
    return +this.selectedUSLang2.VALUE3 || 0;
  }
  set USDICTNOTEID(newValue: number) {
    this.selectedUSLang2.VALUE3 = String(newValue);
  }
  get USDICTITEMS(): string {
    return this.selectedUSLang2.VALUE4 || '0';
  }
  set USDICTITEMS(newValue: string) {
    this.selectedUSLang2.VALUE4 = newValue;
  }
  private selectedUSLang4!: MUserSetting;
  get USVOICEID(): number {
    return +this.selectedUSLang4.VALUE3 || 0;
  }
  set USVOICEID(newValue: number) {
    this.selectedUSLang4.VALUE3 = String(newValue);
  }
  private selectedUSTextbook!: MUserSetting;
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

  languages: MLanguage[] = [];
  selectedLang!: MLanguage;

  voices: MVoice[] = [];
  speech = new Speech.default();
  private _selectedVoice: MVoice | null = null;
  get selectedVoice(): MVoice | null {
    return this._selectedVoice;
  }
  set selectedVoice(newValue: MVoice | null) {
    this._selectedVoice = newValue;
    this.USVOICEID = newValue ? newValue.ID : 0;
    this.speech.setVoice(newValue ? newValue.VOICENAME : '');
  }

  dictsMean: MDictMean[] = [];
  dictItems: MDictItem[] = [];
  private _selectedDictItem!: MDictItem;
  get selectedDictItem(): MDictItem {
    return this._selectedDictItem;
  }
  set selectedDictItem(newValue: MDictItem) {
    this._selectedDictItem = newValue;
    this.USDICTITEM = this._selectedDictItem.DICTID;
  }

  dictsNote: MDictNote[] = [];
  private _selectedDictNote: MDictNote | null = null;
  get selectedDictNote(): MDictNote | null {
    return this._selectedDictNote;
  }
  set selectedDictNote(newValue: MDictNote | null) {
    this._selectedDictNote = newValue;
    if (newValue) this.USDICTNOTEID = newValue.ID;
  }

  textbooks: MTextbook[] = [];
  private _selectedTextbook: MTextbook;
  get selectedTextbook(): MTextbook {
    return this._selectedTextbook;
  }
  set selectedTextbook(newValue: MTextbook) {
    this._selectedTextbook = newValue;
    this.USTEXTBOOKID = newValue.ID;
    this.selectedUSTextbook = this.userSettings.find(value => value.KIND === 3 && value.ENTITYID === newValue.ID)!;
  }

  get units(): MSelectItem[] {
    return this.selectedTextbook.units;
  }
  get unitCount(): number {
    return this.units.length;
  }
  get parts(): MSelectItem[] {
    return this.selectedTextbook.parts;
  }
  get partCount(): number {
    return this.parts.length;
  }
  get isSinglePart(): boolean {
    return this.partCount === 1;
  }

  autoCorrects: MAutoCorrect[] = [];

  constructor(@Inject private langService: LanguageService,
              @Inject private userSettingService: UserSettingService,
              @Inject private dictMeanService: DictMeanService,
              @Inject private dictNoteService: DictNoteService,
              @Inject private textbookService: TextbookService,
              @Inject private autoCorrectService: AutoCorrectService,
              @Inject private voiceService: VoicesService,
              @Inject private wordsFamiService: WordsFamiService) {
    this.speech.init();
  }

  getData(): Observable<void> {
    return forkJoin([this.langService.getData(), this.userSettingService.getDataByUser(userid)]).pipe(
      mergeMap(res => {
        this.languages = res[0] as MLanguage[];
        this.userSettings = res[1] as MUserSetting[];
        this.selectedUSUser0 = this.userSettings.find(value => value.KIND === 1 && value.ENTITYID === 0);
        this.selectedUSUser1 = this.userSettings.find(value => value.KIND === 1 && value.ENTITYID === 1);
        this.USLEVELCOLORS = {};
        this.selectedUSUser0.VALUE4.split('\r\n').map(v => v.split(','))
          .forEach(v => this.USLEVELCOLORS[+v[0]] = [v[1], v[2]]);
        return this.setSelectedLang(this.languages.find(value => value.ID === this.USLANGID)!);
      }));
  }

  setSelectedLang(lang: MLanguage): Observable<void> {
    this.selectedLang = lang;
    this.USLANGID = this.selectedLang.ID;
    this.selectedUSLang2 = this.userSettings.find(value => value.KIND === 2 && value.ENTITYID === this.USLANGID)!;
    this.selectedUSLang4 = this.userSettings.find(value => value.KIND === 4 && value.ENTITYID === this.USLANGID)!;
    const dicts = this.USDICTITEMS.split('\r\n');
    return forkJoin([
      this.dictMeanService.getDataByLang(this.USLANGID),
      this.dictNoteService.getDataByLang(this.USLANGID),
      this.textbookService.getDataByLang(this.USLANGID),
      this.autoCorrectService.getDataByLang(this.USLANGID),
      this.voiceService.getDataByLang(this.USLANGID)]).pipe(
      map(res => {
        this.dictsMean = res[0] as MDictMean[];
        let i = 0;
        this.dictItems = _.flatMap(dicts, d => {
          if (d === '0')
            return _.map(this.dictsMean, d2 => new MDictItem(String(d2.DICTID), d2.DICTNAME));
          else {
            i++;
            return [new MDictItem(d, `Custom${i}`)];
          }
        });
        this.selectedDictItem = this.dictItems.find(value => value.DICTID === this.USDICTITEM)!;
        this.dictsNote = res[1] as MDictNote[];
        this.selectedDictNote = this.dictsNote.length === 0 ? null : this.dictsNote.find(value => value.ID === this.USDICTNOTEID);
        this.textbooks = res[2] as MTextbook[];
        this.selectedTextbook = this.textbooks.find(value => value.ID === this.USTEXTBOOKID)!;
        this.autoCorrects = res[3] as MAutoCorrect[];
        this.voices = res[4] as MVoice[];
        const v = this.voices.find(value => value.ID === this.USVOICEID);
        this.selectedVoice = v ? v : this.voices.length > 0 ? this.voices[0] : null;
      }));
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
    return this.userSettingService.updateTextbook(this.selectedUSLang2.ID, this.USTEXTBOOKID);
  }

  updateDictItem(): Observable<number> {
    return this.userSettingService.updateDictItem(this.selectedUSLang2.ID, this.USDICTITEM);
  }

  updateDictNote(): Observable<number> {
    return this.userSettingService.updateDictNote(this.selectedUSLang2.ID, this.USDICTNOTEID);
  }

  updateVoice(): Observable<number> {
    return this.userSettingService.updateVoice(this.selectedUSLang4.ID, this.USVOICEID);
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

  setColorStyle(o: MWordColor) {
    const c = this.USLEVELCOLORS[o.LEVEL];
    o.colorStyle = !c ? {} : {
      'background-color': '#' + c[0],
      'color': '#' + c[1],
    };
  }

  setColorStyles(words: MWordColor[]) {
    words.forEach(o => this.setColorStyle(o));
  }

  updateLevel(o: MWordColor, wordid: number, delta: number): Observable<void> {
    o.LEVEL += delta;
    this.setColorStyle(o);
    if (o.colorStyle['color'] || o.LEVEL === 0)
      return this.wordsFamiService.update(wordid, o.LEVEL).pipe(map(_ => {}));
    else {
      o.LEVEL -= delta;
      this.setColorStyle(o);
      return empty;
    }
  }

  speak(text: string) {
    this.speech.speak({
      text,
      queue: false,
    });
  }
}
