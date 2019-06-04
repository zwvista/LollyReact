import { concatMap, map } from 'rxjs/operators';
import { Inject, Injectable } from 'react.di';
import { LanguageService } from '../services/language.service';
import { UserSettingService } from '../services/user-setting.service';
import { MUserSetting } from '../models/user-setting';
import { MLanguage } from '../models/language';
import { MDictItem, MDictReference, MDictNote, MDictTranslation } from '../models/dictionary';
import { MTextbook } from '../models/textbook';
import { forkJoin, Observable, of } from 'rxjs';
import { DictReferenceService, DictNoteService, DictTranslationService } from '../services/dictionary.service';
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
  get USREADINTERVAL(): number {
    return +this.selectedUSUser1.VALUE1;
  }
  get USREVIEWINTERVAL(): number {
    return +this.selectedUSUser1.VALUE2;
  }
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
  private selectedUSLang3!: MUserSetting;
  get USDICTTRANSLATIONID(): number {
    return +this.selectedUSLang3.VALUE1 || 0;
  }
  set USDICTTRANSLATIONID(newValue: number) {
    this.selectedUSLang3.VALUE1 = String(newValue);
  }
  private selectedUSLang4!: MUserSetting;
  get USVOICEID(): number {
    return +(this.selectedUSLang4.VALUE1 || '0');
  }
  set USVOICEID(newValue: number) {
    this.selectedUSLang4.VALUE1 = String(newValue);
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

  dictsReference: MDictReference[] = [];
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

  dictsTranslation: MDictTranslation[] = [];
  private _selectedDictTranslation: MDictTranslation | null = null;
  get selectedDictTranslation(): MDictTranslation | null {
    return this._selectedDictTranslation;
  }
  set selectedDictTranslation(newValue: MDictTranslation | null) {
    this._selectedDictTranslation = newValue;
    if (newValue) this.USDICTTRANSLATIONID = newValue.ID;
  }

  textbooks: MTextbook[] = [];
  private _selectedTextbook: MTextbook;
  get selectedTextbook(): MTextbook {
    return this._selectedTextbook;
  }
  set selectedTextbook(newValue: MTextbook) {
    this._selectedTextbook = newValue;
    this.USTEXTBOOKID = newValue.ID;
    this.selectedUSTextbook = this.userSettings.find(value => value.KIND === 11 && value.ENTITYID === newValue.ID)!;
    this.toType = this.isSingleUnit ? 0 : this.isSingleUnitPart ? 1 : 2;
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

  toTypes = ['Unit', 'Part', 'To'].map((v, i) => new MSelectItem(i, v));
  toType = 0;

  autoCorrects: MAutoCorrect[] = [];

  settingsListener: SettingsListener | null = null;

  constructor(@Inject private langService: LanguageService,
              @Inject private userSettingService: UserSettingService,
              @Inject private dictReferenceService: DictReferenceService,
              @Inject private dictNoteService: DictNoteService,
              @Inject private dictTranslationService: DictTranslationService,
              @Inject private textbookService: TextbookService,
              @Inject private autoCorrectService: AutoCorrectService,
              @Inject private voiceService: VoicesService,
              @Inject private wordsFamiService: WordsFamiService) {
    this.speech.init();
  }

  getData(): Observable<number> {
    return forkJoin([this.langService.getData(), this.userSettingService.getDataByUser(userid)]).pipe(
      concatMap(res => {
        this.languages = res[0] as MLanguage[];
        this.userSettings = res[1] as MUserSetting[];
        this.selectedUSUser0 = this.userSettings.find(value => value.KIND === 1 && value.ENTITYID === 0);
        this.selectedUSUser1 = this.userSettings.find(value => value.KIND === 1 && value.ENTITYID === 1);
        this.USLEVELCOLORS = {};
        this.selectedUSUser0.VALUE4.split('\r\n').map(v => v.split(','))
          .forEach(v => this.USLEVELCOLORS[+v[0]] = [v[1], v[2]]);
        if (this.settingsListener) this.settingsListener.onGetData();
        return this.setSelectedLang(this.languages.find(value => value.ID === this.USLANGID)!);
      }));
  }

  setSelectedLang(lang: MLanguage): Observable<number> {
    const isinit = lang.ID === this.USLANGID;
    this.selectedLang = lang;
    this.USLANGID = this.selectedLang.ID;
    this.selectedUSLang2 = this.userSettings.find(value => value.KIND === 2 && value.ENTITYID === this.USLANGID)!;
    this.selectedUSLang3 = this.userSettings.find(value => value.KIND === 3 && value.ENTITYID === this.USLANGID)!;
    this.selectedUSLang4 = this.userSettings.find(value => value.KIND === 4 && value.ENTITYID === this.USLANGID)!;
    const dicts = this.USDICTITEMS.split('\r\n');
    return forkJoin([
      this.dictReferenceService.getDataByLang(this.USLANGID),
      this.dictNoteService.getDataByLang(this.USLANGID),
      this.dictTranslationService.getDataByLang(this.USLANGID),
      this.textbookService.getDataByLang(this.USLANGID),
      this.autoCorrectService.getDataByLang(this.USLANGID),
      this.voiceService.getDataByLang(this.USLANGID)]).pipe(
      concatMap(res => {
        this.dictsReference = res[0] as MDictReference[];
        let i = 0;
        this.dictItems = _.flatMap(dicts, d => {
          if (d === '0')
            return _.map(this.dictsReference, d2 => new MDictItem(String(d2.DICTID), d2.DICTNAME));
          else {
            i++;
            return [new MDictItem(d, `Custom${i}`)];
          }
        });
        this.selectedDictItem = this.dictItems.find(value => value.DICTID === this.USDICTITEM)!;
        this.dictsNote = res[1] as MDictNote[];
        this.selectedDictNote = this.dictsNote.find(value => value.DICTID === this.USDICTNOTEID) ||
          (this.dictsNote.length === 0 ? null : this.dictsNote[0]);
        this.dictsTranslation = res[2] as MDictTranslation[];
        this.selectedDictTranslation = this.dictsTranslation.find(value => value.DICTID === this.USDICTTRANSLATIONID) ||
          (this.dictsTranslation.length === 0 ? null : this.dictsTranslation[0]);
        this.textbooks = res[3] as MTextbook[];
        this.selectedTextbook = this.textbooks.find(value => value.ID === this.USTEXTBOOKID)!;
        this.autoCorrects = res[4] as MAutoCorrect[];
        this.voices = res[5] as MVoice[];
        this.selectedVoice = this.voices.find(value => value.ID === this.USVOICEID) ||
          (this.voices.length === 0 ? null : this.voices[0]);
        if (isinit) {
          if (this.settingsListener) this.settingsListener.onUpdateLang();
          return of(0);
        } else
          return this.updateLang();
      }));
  }

  dictHtml(word: string, dictids: string[]): string {
    let s = '<html><body>\n';
    dictids.forEach((dictid, i) => {
      const item = this.dictsReference.find(v => String(v.DICTID) === dictid);
      const ifrId = `ifr${i + 1}`;
      const url = item.urlString(word, this.autoCorrects);
      s += `<iframe id='$ifrId' frameborder='1' style='width:100%; height:500px; display:block' src='$url'></iframe>\n`;
    });
    s += '</body></html>\\n';
    return s;
  }

  updateLang(): Observable<number> {
    return this.userSettingService.updateLang(this.selectedUSUser0.ID, this.USLANGID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateLang();
        return 0;
      }),
    );
  }

  updateTextbook(): Observable<number> {
    return this.userSettingService.updateTextbook(this.selectedUSLang2.ID, this.USTEXTBOOKID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateTextbook();
        return 0;
      }),
    );
  }

  updateDictItem(): Observable<number> {
    return this.userSettingService.updateDictItem(this.selectedUSLang2.ID, this.USDICTITEM).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictItem();
        return 0;
      }),
    );
  }

  updateDictNote(): Observable<number> {
    return this.userSettingService.updateDictNote(this.selectedUSLang2.ID, this.USDICTNOTEID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictNote();
        return 0;
      }),
    );
  }

  updateDictTranslation(): Observable<number> {
    return this.userSettingService.updateDictTranslation(this.selectedUSLang3.ID, this.USDICTNOTEID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictTranslation();
        return 0;
      }),
    );
  }

  updateVoice(): Observable<number> {
    return this.userSettingService.updateVoice(this.selectedUSLang4.ID, this.USVOICEID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateVoice();
        return 0;
      }),
    );
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
      return of();
    }
  }

  speak(text: string) {
    this.speech.speak({
      text,
      queue: false,
    });
  }

  updateUnitFrom(value: number): Observable<number> {
    return this.doUpdateUnitFrom(value).pipe(
      concatMap(_ => this.toType === 0 ? this.doUpdateSingleUnit() :
        this.toType === 1 || this.isInvalidUnitPart ? this.doUpdateUnitPartTo() : of(0)),
    );
  }

  updatePartFrom(value: number): Observable<number> {
    return this.doUpdatePartFrom(value).pipe(
      concatMap(_ => this.toType === 1 || this.isInvalidUnitPart ? this.doUpdateUnitPartTo() : of(0)),
    );
  }

  updateToType(value: number): Observable<number> {
    this.toType = value;
    return this.toType === 0 ? this.doUpdateSingleUnit() :
      this.toType === 1 ? this.doUpdateUnitPartTo() : of(0);
  }

  previousUnitPart(): Observable<number> {
    if (this.toType === 0)
      if (this.USUNITFROM > 1)
        return forkJoin([this.doUpdateUnitFrom(this.USUNITFROM - 1),
          this.doUpdateUnitTo(this.USUNITFROM)]).pipe(map(_ => 0));
      else
        return of(0);
    else if (this.USPARTFROM > 1)
      return forkJoin([this.doUpdatePartFrom(this.USPARTFROM - 1),
        this.doUpdateUnitPartTo()]).pipe(map(_ => 0));
    else if (this.USUNITFROM > 1)
      return forkJoin([this.doUpdateUnitFrom(this.USUNITFROM - 1),
        this.doUpdatePartFrom(this.partCount), this.doUpdateUnitPartTo()]).pipe(map(_ => 0));
    else
      return of(0);
  }

  nextUnitPart(): Observable<number> {
    if (this.toType === 0)
      if (this.USUNITFROM < this.unitCount)
        return forkJoin([this.doUpdateUnitFrom(this.USUNITFROM + 1),
          this.doUpdateUnitTo(this.USUNITFROM)]).pipe(map(_ => 0));
      else
        return of(0);
    else if (this.USPARTFROM < this.partCount)
      return forkJoin([this.doUpdatePartFrom(this.USPARTFROM + 1),
        this.doUpdateUnitPartTo()]).pipe(map(_ => 0));
    else if (this.USUNITFROM < this.unitCount)
      return forkJoin([this.doUpdateUnitFrom(this.USUNITFROM + 1),
        this.doUpdatePartFrom(1), this.doUpdateUnitPartTo()]).pipe(map(_ => 0));
    else
      return of(0);
  }

  updateUnitTo(value: number): Observable<number> {
    return this.doUpdateUnitTo(value).pipe(
      concatMap(_ => this.toType === 1 || this.isInvalidUnitPart ? this.doUpdateUnitPartFrom() : of(0)),
    );
  }

  updatePartTo(value: number): Observable<number> {
    return this.doUpdatePartTo(value).pipe(
      concatMap(_ => this.toType === 1 || this.isInvalidUnitPart ? this.doUpdateUnitPartFrom() : of(0)),
    );
  }

  private doUpdateUnitPartFrom(): Observable<number> {
    return forkJoin([this.doUpdateUnitFrom(this.USUNITTO), this.doUpdatePartFrom(this.USPARTTO)])
      .pipe(map(_ => 0));
  }

  private doUpdateUnitPartTo(): Observable<number> {
    return forkJoin([this.doUpdateUnitTo(this.USUNITFROM), this.doUpdatePartTo(this.USPARTFROM)])
      .pipe(map(_ => 0));
  }

  private doUpdateSingleUnit(): Observable<number> {
    return forkJoin([this.doUpdateUnitTo(this.USUNITFROM), this.doUpdatePartFrom(1),
      this.doUpdatePartTo(this.partCount)])
      .pipe(map(_ => 0));
  }

  private doUpdateUnitFrom(v: number): Observable<number> {
    if (this.USUNITFROM === v) return of(0);
    this.USUNITFROM = v;
    return this.userSettingService.updateUnitFrom(this.selectedUSTextbook.ID, this.USUNITFROM).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateUnitFrom();
        return 0;
      }),
    );
  }

  private doUpdatePartFrom(v: number): Observable<number> {
    if (this.USPARTFROM === v) return of(0);
    this.USPARTFROM = v;
    return this.userSettingService.updatePartFrom(this.selectedUSTextbook.ID, this.USPARTFROM).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdatePartFrom();
        return 0;
      }),
    );
  }

  private doUpdateUnitTo(v: number): Observable<number> {
    if (this.USUNITTO === v) return of(0);
    this.USUNITTO = v;
    return this.userSettingService.updateUnitTo(this.selectedUSTextbook.ID, this.USUNITTO).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateUnitTo();
        return 0;
      }),
    );
  }

  private doUpdatePartTo(v: number): Observable<number> {
    if (this.USPARTTO === v) return of(0);
    this.USPARTTO = v;
    return this.userSettingService.updatePartTo(this.selectedUSTextbook.ID, this.USPARTTO).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdatePartTo();
        return 0;
      }),
    );
  }
}

export interface SettingsListener {
  onGetData(): void;
  onUpdateLang(): void;
  onUpdateTextbook(): void;
  onUpdateDictItem(): void;
  onUpdateDictNote(): void;
  onUpdateDictTranslation(): void;
  onUpdateVoice(): void;
  onUpdateUnitFrom(): void;
  onUpdatePartFrom(): void;
  onUpdateUnitTo(): void;
  onUpdatePartTo(): void;
}
