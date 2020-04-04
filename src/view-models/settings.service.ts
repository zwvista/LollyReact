import { concatMap, map } from 'rxjs/operators';
import { Inject, Injectable } from 'react.di';
import { LanguageService } from '../services/language.service';
import { UserSettingService } from '../services/user-setting.service';
import { MUserSetting, MUserSettingInfo } from '../models/user-setting';
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
import { MUSMapping } from '../models/usmapping';
import { UsMappingService } from '../services/us-mapping.service';

const userid = 1;

@Injectable
export class SettingsService {

  usMappings: MUSMapping[] = [];
  userSettings: MUserSetting[] = [];
  private getUSValue(info: MUserSettingInfo): string | null {
    return this.userSettings.find(v => v.ID === info.USERSETTINGID)!['VALUE' + info.VALUEID]!;
  }
  private setUSValue(info: MUserSettingInfo, value: string) {
    this.userSettings.find(v => v.ID === info.USERSETTINGID)!['VALUE' + info.VALUEID]! = value;
  }
  private INFO_USLANGID: MUserSettingInfo = new MUserSettingInfo();
  private get USLANGID(): number {
    return +this.getUSValue(this.INFO_USLANGID)!;
  }
  private set USLANGID(newValue: number) {
    this.setUSValue(this.INFO_USLANGID, String(newValue));
  }
  private INFO_USROWSPERPAGEOPTIONS: MUserSettingInfo = new MUserSettingInfo();
  get USROWSPERPAGEOPTIONS(): number[] {
    return this.getUSValue(this.INFO_USROWSPERPAGEOPTIONS)!.split(',').map(value => +value);
  }
  private INFO_USROWSPERPAGE: MUserSettingInfo = new MUserSettingInfo();
  get USROWSPERPAGE(): number {
    return +this.getUSValue(this.INFO_USROWSPERPAGE)!;
  }
  private INFO_USLEVELCOLORS: MUserSettingInfo = new MUserSettingInfo();
  USLEVELCOLORS!: {number: [string]} | {};
  private INFO_USSCANINTERVAL: MUserSettingInfo = new MUserSettingInfo();
  get USSCANINTERVAL(): number {
    return +this.getUSValue(this.INFO_USSCANINTERVAL)!;
  }
  private INFO_USREVIEWINTERVAL: MUserSettingInfo = new MUserSettingInfo();
  get USREVIEWINTERVAL(): number {
    return +this.getUSValue(this.INFO_USREVIEWINTERVAL)!;
  }
  private INFO_USTEXTBOOKID: MUserSettingInfo = new MUserSettingInfo();
  get USTEXTBOOKID(): number {
    return +this.getUSValue(this.INFO_USTEXTBOOKID)!;
  }
  set USTEXTBOOKID(newValue: number) {
    this.setUSValue(this.INFO_USTEXTBOOKID, String(newValue));
  }
  private INFO_USDICTITEM: MUserSettingInfo = new MUserSettingInfo();
  get USDICTITEM(): string {
    return this.getUSValue(this.INFO_USDICTITEM)!;
  }
  set USDICTITEM(newValue: string) {
    this.setUSValue(this.INFO_USDICTITEM, newValue);
  }
  private INFO_USDICTNOTEID: MUserSettingInfo = new MUserSettingInfo();
  get USDICTNOTEID(): number {
    return +this.getUSValue(this.INFO_USDICTNOTEID)! || 0;
  }
  set USDICTNOTEID(newValue: number) {
    this.setUSValue(this.INFO_USDICTNOTEID, String(newValue));
  }
  private INFO_USDICTITEMS: MUserSettingInfo = new MUserSettingInfo();
  get USDICTITEMS(): string {
    return this.getUSValue(this.INFO_USDICTITEMS) || '0';
  }
  set USDICTITEMS(newValue: string) {
    this.setUSValue(this.INFO_USDICTITEMS, newValue);
  }
  private INFO_USDICTTRANSLATIONID: MUserSettingInfo = new MUserSettingInfo();
  get USDICTTRANSLATIONID(): number {
    return +this.getUSValue(this.INFO_USDICTTRANSLATIONID)! || 0;
  }
  set USDICTTRANSLATIONID(newValue: number) {
    this.setUSValue(this.INFO_USDICTTRANSLATIONID, String(newValue));
  }
  private INFO_USWEBVOICEID: MUserSettingInfo = new MUserSettingInfo();
  get USWEBVOICEID(): number {
    return +(this.getUSValue(this.INFO_USWEBVOICEID) || '0');
  }
  set USWEBVOICEID(newValue: number) {
    this.setUSValue(this.INFO_USWEBVOICEID, String(newValue));
  }
  private INFO_USUNITFROM: MUserSettingInfo = new MUserSettingInfo();
  get USUNITFROM(): number {
    return +this.getUSValue(this.INFO_USUNITFROM)!;
  }
  set USUNITFROM(newValue: number) {
    this.setUSValue(this.INFO_USUNITFROM, String(newValue));
  }
  private INFO_USPARTFROM: MUserSettingInfo = new MUserSettingInfo();
  get USPARTFROM(): number {
    return +this.getUSValue(this.INFO_USPARTFROM)!;
  }
  set USPARTFROM(newValue: number) {
    this.setUSValue(this.INFO_USPARTFROM, String(newValue));
  }
  private INFO_USUNITTO: MUserSettingInfo = new MUserSettingInfo();
  get USUNITTO(): number {
    return +this.getUSValue(this.INFO_USUNITTO)!;
  }
  set USUNITTO(newValue: number) {
    this.setUSValue(this.INFO_USUNITTO, String(newValue));
  }
  private INFO_USPARTTO: MUserSettingInfo = new MUserSettingInfo();
  get USPARTTO(): number {
    return +this.getUSValue(this.INFO_USPARTTO)!;
  }
  set USPARTTO(newValue: number) {
    this.setUSValue(this.INFO_USPARTTO, String(newValue));
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
    this.USWEBVOICEID = newValue ? newValue.ID : 0;
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
    this.INFO_USUNITFROM = this.getUSInfo(MUSMapping.NAME_USUNITFROM);
    this.INFO_USPARTFROM = this.getUSInfo(MUSMapping.NAME_USPARTFROM);
    this.INFO_USUNITTO = this.getUSInfo(MUSMapping.NAME_USUNITTO);
    this.INFO_USPARTTO = this.getUSInfo(MUSMapping.NAME_USPARTTO);
    this.toType = this.isSingleUnit ? 0 : this.isSingleUnitPart ? 1 : 2;
  }
  textbookFilters: MSelectItem[] = [];

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

  wordFilterTypes = ['None', 'Word', 'Note'].map((v, i) => new MSelectItem(i, v));
  phraseFilterTypes = ['None', 'Phrase', 'Translation'].map((v, i) => new MSelectItem(i, v));

  constructor(@Inject private langService: LanguageService,
              @Inject private usMappingService: UsMappingService,
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

  private getUSInfo(name: string): MUserSettingInfo {
    const o = this.usMappings.find(v => v.NAME === name)!;
    const entityid = o.ENTITYID !== -1 ? o.ENTITYID :
      o.LEVEL === 1 ? this.selectedLang.ID :
        o.LEVEL === 2 ? this.selectedTextbook.ID :
          0;
    const o2 = this.userSettings.find((v => v.KIND === o.KIND && v.ENTITYID === entityid))!;
    const o3 = new MUserSettingInfo();
    o3.USERSETTINGID = o2.ID;
    o3.VALUEID = o.VALUEID;
    return o3;
  }

  getData(): Observable<number> {
    return forkJoin([this.langService.getData(),
      this.usMappingService.getData(),
      this.userSettingService.getDataByUser(userid)]).pipe(
      concatMap(res => {
        this.languages = res[0] as MLanguage[];
        this.usMappings = res[1] as MUSMapping[];
        this.userSettings = res[2] as MUserSetting[];
        this.INFO_USLANGID = this.getUSInfo(MUSMapping.NAME_USLANGID);
        this.INFO_USROWSPERPAGEOPTIONS = this.getUSInfo(MUSMapping.NAME_USROWSPERPAGEOPTIONS);
        this.INFO_USROWSPERPAGE = this.getUSInfo(MUSMapping.NAME_USROWSPERPAGE);
        this.INFO_USLEVELCOLORS = this.getUSInfo(MUSMapping.NAME_USLEVELCOLORS);
        this.INFO_USSCANINTERVAL = this.getUSInfo(MUSMapping.NAME_USSCANINTERVAL);
        this.INFO_USREVIEWINTERVAL = this.getUSInfo(MUSMapping.NAME_USREVIEWINTERVAL);
        this.USLEVELCOLORS = {};
        this.getUSValue(this.INFO_USLEVELCOLORS)!.split('\r\n').map(v => v.split(','))
          .forEach(v => this.USLEVELCOLORS[+v[0]] = [v[1], v[2]]);
        if (this.settingsListener) this.settingsListener.onGetData();
        return this.setSelectedLang(this.languages.find(value => value.ID === this.USLANGID)!);
      }));
  }

  setSelectedLang(lang: MLanguage): Observable<number> {
    const isinit = lang.ID === this.USLANGID;
    this.selectedLang = lang;
    this.USLANGID = this.selectedLang.ID;
    this.INFO_USTEXTBOOKID = this.getUSInfo(MUSMapping.NAME_USTEXTBOOKID);
    this.INFO_USDICTITEM = this.getUSInfo(MUSMapping.NAME_USDICTITEM);
    this.INFO_USDICTNOTEID = this.getUSInfo(MUSMapping.NAME_USDICTNOTEID);
    this.INFO_USDICTITEMS = this.getUSInfo(MUSMapping.NAME_USDICTITEMS);
    this.INFO_USDICTTRANSLATIONID = this.getUSInfo(MUSMapping.NAME_USDICTTRANSLATIONID);
    this.INFO_USWEBVOICEID = this.getUSInfo(MUSMapping.NAME_USWEBVOICEID);
    return forkJoin([
      this.dictReferenceService.getDataByLang(this.USLANGID),
      this.dictNoteService.getDataByLang(this.USLANGID),
      this.dictTranslationService.getDataByLang(this.USLANGID),
      this.textbookService.getDataByLang(this.USLANGID),
      this.autoCorrectService.getDataByLang(this.USLANGID),
      this.voiceService.getDataByLang(this.USLANGID)]).pipe(
      concatMap(res => {
        this.dictsReference = res[0] as MDictReference[];
        this.dictItems = _.map(this.dictsReference, d2 => new MDictItem(String(d2.DICTID), d2.DICTNAME));
        this.selectedDictItem = this.dictItems.find(value => value.DICTID === this.USDICTITEM)!;
        this.dictsNote = res[1] as MDictNote[];
        this.selectedDictNote = this.dictsNote.find(value => value.DICTID === this.USDICTNOTEID) ||
          (this.dictsNote.length === 0 ? null : this.dictsNote[0]);
        this.dictsTranslation = res[2] as MDictTranslation[];
        this.selectedDictTranslation = this.dictsTranslation.find(value => value.DICTID === this.USDICTTRANSLATIONID) ||
          (this.dictsTranslation.length === 0 ? null : this.dictsTranslation[0]);
        this.textbooks = res[3] as MTextbook[];
        this.selectedTextbook = this.textbooks.find(value => value.ID === this.USTEXTBOOKID)!;
        this.textbookFilters = this.textbooks.map(value => new MSelectItem(value.ID, value.NAME));
        this.textbookFilters = [new MSelectItem(0, 'All Textbooks')].concat(this.textbookFilters);
        this.autoCorrects = res[4] as MAutoCorrect[];
        this.voices = res[5] as MVoice[];
        this.selectedVoice = this.voices.find(value => value.ID === this.USWEBVOICEID) ||
          (this.voices.length === 0 ? null : this.voices[0]);
        if (isinit) {
          if (this.settingsListener) this.settingsListener.onUpdateLang();
          return of(0);
        } else
          return this.updateLang();
      }));
  }

  updateLang(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USLANGID, this.USLANGID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateLang();
        return 0;
      }),
    );
  }

  updateTextbook(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USTEXTBOOKID, this.USTEXTBOOKID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateTextbook();
        return 0;
      }),
    );
  }

  updateDictItem(): Observable<number> {
    return this.userSettingService.updateStringValue(this.INFO_USDICTITEM, this.USDICTITEM).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictItem();
        return 0;
      }),
    );
  }

  updateDictNote(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USDICTNOTEID, this.USDICTNOTEID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictNote();
        return 0;
      }),
    );
  }

  updateDictTranslation(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USDICTTRANSLATIONID, this.USDICTNOTEID).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictTranslation();
        return 0;
      }),
    );
  }

  updateVoice(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USWEBVOICEID, this.USWEBVOICEID).pipe(
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
    return this.userSettingService.updateIntValue(this.INFO_USUNITFROM, this.USUNITFROM).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateUnitFrom();
        return 0;
      }),
    );
  }

  private doUpdatePartFrom(v: number): Observable<number> {
    if (this.USPARTFROM === v) return of(0);
    this.USPARTFROM = v;
    return this.userSettingService.updateIntValue(this.INFO_USPARTFROM, this.USPARTFROM).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdatePartFrom();
        return 0;
      }),
    );
  }

  private doUpdateUnitTo(v: number): Observable<number> {
    if (this.USUNITTO === v) return of(0);
    this.USUNITTO = v;
    return this.userSettingService.updateIntValue(this.INFO_USUNITTO, this.USUNITTO).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateUnitTo();
        return 0;
      }),
    );
  }

  private doUpdatePartTo(v: number): Observable<number> {
    if (this.USPARTTO === v) return of(0);
    this.USPARTTO = v;
    return this.userSettingService.updateIntValue(this.INFO_USPARTTO, this.USPARTTO).pipe(
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
