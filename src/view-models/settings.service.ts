import { concatMap, map } from 'rxjs/operators';
import { Inject, Injectable } from 'react.di';
import { LanguageService } from '../services/misc/language.service';
import { UserSettingService } from '../services/misc/user-setting.service';
import { MUserSetting, MUserSettingInfo } from '../models/misc/user-setting';
import { MLanguage } from '../models/misc/language';
import { MDictionary } from '../models/misc/dictionary';
import { MTextbook } from '../models/misc/textbook';
import { forkJoin, Observable, of } from 'rxjs';
import { DictionaryService } from '../services/misc/dictionary.service';
import { TextbookService } from '../services/misc/textbook.service';
import { AutoCorrectService } from '../services/misc/autocorrect.service';
import { autoCorrect, MAutoCorrect } from '../models/misc/autocorrect';
import { MSelectItem } from '../common/selectitem';
import * as Speech from 'speak-tts';
import { VoicesService } from '../services/misc/voices.service';
import { MVoice } from '../models/misc/voice';
import { WordsFamiService } from './words-fami.service';
import { MUSMapping } from '../models/misc/usmapping';
import { UsMappingService } from '../services/misc/us-mapping.service';

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
  private INFO_USLANG: MUserSettingInfo = new MUserSettingInfo();
  private get USLANG(): number {
    return +this.getUSValue(this.INFO_USLANG)!;
  }
  private set USLANG(newValue: number) {
    this.setUSValue(this.INFO_USLANG, String(newValue));
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
  private INFO_USTEXTBOOK: MUserSettingInfo = new MUserSettingInfo();
  get USTEXTBOOK(): number {
    return +this.getUSValue(this.INFO_USTEXTBOOK)!;
  }
  set USTEXTBOOK(newValue: number) {
    this.setUSValue(this.INFO_USTEXTBOOK, String(newValue));
  }
  private INFO_USDICTREFERENCE: MUserSettingInfo = new MUserSettingInfo();
  get USDICTREFERENCE(): string {
    return this.getUSValue(this.INFO_USDICTREFERENCE)!;
  }
  set USDICTREFERENCE(newValue: string) {
    this.setUSValue(this.INFO_USDICTREFERENCE, newValue);
  }
  private INFO_USDICTNOTE: MUserSettingInfo = new MUserSettingInfo();
  get USDICTNOTE(): number {
    return +this.getUSValue(this.INFO_USDICTNOTE)! || 0;
  }
  set USDICTNOTE(newValue: number) {
    this.setUSValue(this.INFO_USDICTNOTE, String(newValue));
  }
  private INFO_USDICTSREFERENCE: MUserSettingInfo = new MUserSettingInfo();
  get USDICTSREFERENCE(): string {
    return this.getUSValue(this.INFO_USDICTSREFERENCE) || '0';
  }
  set USDICTSREFERENCE(newValue: string) {
    this.setUSValue(this.INFO_USDICTSREFERENCE, newValue);
  }
  private INFO_USDICTTRANSLATION: MUserSettingInfo = new MUserSettingInfo();
  get USDICTTRANSLATION(): number {
    return +this.getUSValue(this.INFO_USDICTTRANSLATION)! || 0;
  }
  set USDICTTRANSLATION(newValue: number) {
    this.setUSValue(this.INFO_USDICTTRANSLATION, String(newValue));
  }
  private INFO_USWEBVOICE: MUserSettingInfo = new MUserSettingInfo();
  get USWEBVOICE(): number {
    return +(this.getUSValue(this.INFO_USWEBVOICE) || '0');
  }
  set USWEBVOICE(newValue: number) {
    this.setUSValue(this.INFO_USWEBVOICE, String(newValue));
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
    this.USWEBVOICE = newValue ? newValue.ID : 0;
    this.speech.setVoice(newValue ? newValue.VOICENAME : '');
  }

  dictsReference: MDictionary[] = [];
  private _selectedDictReference!: MDictionary;
  get selectedDictReference(): MDictionary {
    return this._selectedDictReference;
  }
  set selectedDictReference(newValue: MDictionary) {
    this._selectedDictReference = newValue;
    this.USDICTREFERENCE = String(this._selectedDictReference.DICTID);
  }

  dictsNote: MDictionary[] = [];
  private _selectedDictNote: MDictionary | null = null;
  get selectedDictNote(): MDictionary | null {
    return this._selectedDictNote;
  }
  set selectedDictNote(newValue: MDictionary | null) {
    this._selectedDictNote = newValue;
    if (newValue) this.USDICTNOTE = newValue.ID;
  }

  dictsTranslation: MDictionary[] = [];
  private _selectedDictTranslation: MDictionary | null = null;
  get selectedDictTranslation(): MDictionary | null {
    return this._selectedDictTranslation;
  }
  set selectedDictTranslation(newValue: MDictionary | null) {
    this._selectedDictTranslation = newValue;
    if (newValue) this.USDICTTRANSLATION = newValue.ID;
  }

  textbooks: MTextbook[] = [];
  private _selectedTextbook: MTextbook;
  get selectedTextbook(): MTextbook {
    return this._selectedTextbook;
  }
  set selectedTextbook(newValue: MTextbook) {
    this._selectedTextbook = newValue;
    this.USTEXTBOOK = newValue.ID;
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

  wordFilterTypes = ['Word', 'Note'].map((v, i) => new MSelectItem(i, v));
  phraseFilterTypes = ['Phrase', 'Translation'].map((v, i) => new MSelectItem(i, v));
  patternFilterTypes = ['Pattern', 'Note', 'Tags'].map((v, i) => new MSelectItem(i, v));

  constructor(@Inject private langService: LanguageService,
              @Inject private usMappingService: UsMappingService,
              @Inject private userSettingService: UserSettingService,
              @Inject private dictionaryService: DictionaryService,
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
        this.INFO_USLANG = this.getUSInfo(MUSMapping.NAME_USLANG);
        this.INFO_USROWSPERPAGEOPTIONS = this.getUSInfo(MUSMapping.NAME_USROWSPERPAGEOPTIONS);
        this.INFO_USROWSPERPAGE = this.getUSInfo(MUSMapping.NAME_USROWSPERPAGE);
        this.INFO_USLEVELCOLORS = this.getUSInfo(MUSMapping.NAME_USLEVELCOLORS);
        this.INFO_USSCANINTERVAL = this.getUSInfo(MUSMapping.NAME_USSCANINTERVAL);
        this.INFO_USREVIEWINTERVAL = this.getUSInfo(MUSMapping.NAME_USREVIEWINTERVAL);
        this.USLEVELCOLORS = {};
        this.getUSValue(this.INFO_USLEVELCOLORS)!.split('\r\n').map(v => v.split(','))
          .forEach(v => this.USLEVELCOLORS[+v[0]] = [v[1], v[2]]);
        if (this.settingsListener) this.settingsListener.onGetData();
        return this.setSelectedLang(this.languages.find(value => value.ID === this.USLANG)!);
      }));
  }

  setSelectedLang(lang: MLanguage): Observable<number> {
    const isinit = lang.ID === this.USLANG;
    this.selectedLang = lang;
    this.USLANG = this.selectedLang.ID;
    this.INFO_USTEXTBOOK = this.getUSInfo(MUSMapping.NAME_USTEXTBOOK);
    this.INFO_USDICTREFERENCE = this.getUSInfo(MUSMapping.NAME_USDICTREFERENCE);
    this.INFO_USDICTNOTE = this.getUSInfo(MUSMapping.NAME_USDICTNOTE);
    this.INFO_USDICTSREFERENCE = this.getUSInfo(MUSMapping.NAME_USDICTSREFERENCE);
    this.INFO_USDICTTRANSLATION = this.getUSInfo(MUSMapping.NAME_USDICTTRANSLATION);
    this.INFO_USWEBVOICE = this.getUSInfo(MUSMapping.NAME_USWEBVOICE);
    return forkJoin([
      this.dictionaryService.getDictsReference(this.USLANG),
      this.dictionaryService.getDictsNote(this.USLANG),
      this.dictionaryService.getDictsTranslation(this.USLANG),
      this.textbookService.getDataByLang(this.USLANG),
      this.autoCorrectService.getDataByLang(this.USLANG),
      this.voiceService.getDataByLang(this.USLANG)]).pipe(
      concatMap(res => {
        this.dictsReference = res[0] as MDictionary[];
        this.selectedDictReference = this.dictsReference.find(value => String(value.DICTID) === this.USDICTREFERENCE)!;
        this.dictsNote = res[1] as MDictionary[];
        this.selectedDictNote = this.dictsNote.find(value => value.DICTID === this.USDICTNOTE) ||
          (this.dictsNote.length === 0 ? null : this.dictsNote[0]);
        this.dictsTranslation = res[2] as MDictionary[];
        this.selectedDictTranslation = this.dictsTranslation.find(value => value.DICTID === this.USDICTTRANSLATION) ||
          (this.dictsTranslation.length === 0 ? null : this.dictsTranslation[0]);
        this.textbooks = res[3] as MTextbook[];
        this.selectedTextbook = this.textbooks.find(value => value.ID === this.USTEXTBOOK)!;
        this.textbookFilters = this.textbooks.map(value => new MSelectItem(value.ID, value.NAME));
        this.textbookFilters = [new MSelectItem(0, 'All Textbooks')].concat(this.textbookFilters);
        this.autoCorrects = res[4] as MAutoCorrect[];
        this.voices = res[5] as MVoice[];
        this.selectedVoice = this.voices.find(value => value.ID === this.USWEBVOICE) ||
          (this.voices.length === 0 ? null : this.voices[0]);
        if (isinit) {
          if (this.settingsListener) this.settingsListener.onUpdateLang();
          return of(0);
        } else
          return this.updateLang();
      }));
  }

  updateLang(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USLANG, this.USLANG).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateLang();
        return 0;
      }),
    );
  }

  updateTextbook(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USTEXTBOOK, this.USTEXTBOOK).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateTextbook();
        return 0;
      }),
    );
  }

  updateDictReference(): Observable<number> {
    return this.userSettingService.updateStringValue(this.INFO_USDICTREFERENCE, this.USDICTREFERENCE).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictReference();
        return 0;
      }),
    );
  }

  updateDictNote(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USDICTNOTE, this.USDICTNOTE).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictNote();
        return 0;
      }),
    );
  }

  updateDictTranslation(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USDICTTRANSLATION, this.USDICTNOTE).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateDictTranslation();
        return 0;
      }),
    );
  }

  updateVoice(): Observable<number> {
    return this.userSettingService.updateIntValue(this.INFO_USWEBVOICE, this.USWEBVOICE).pipe(
      map( _ => {
        if (this.settingsListener) this.settingsListener.onUpdateVoice();
        return 0;
      }),
    );
  }

  autoCorrectInput(text: string): string {
    return autoCorrect(text, this.autoCorrects, row => row.INPUT, row => row.EXTENDED);
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
  onUpdateDictReference(): void;
  onUpdateDictNote(): void;
  onUpdateDictTranslation(): void;
  onUpdateVoice(): void;
  onUpdateUnitFrom(): void;
  onUpdatePartFrom(): void;
  onUpdateUnitTo(): void;
  onUpdatePartTo(): void;
}
