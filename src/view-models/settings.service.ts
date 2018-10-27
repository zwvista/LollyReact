
import {map, mergeMap} from 'rxjs/operators';
import { Injectable, Inject } from 'react.di';
import { LanguageService } from '../services/language.service';
import { UserSettingService } from '../services/user-setting.service';
import { UserSetting } from '../models/user-setting';
import { Language } from '../models/language';
import { DictNote, DictOnline } from '../models/dictionary';
import { Textbook } from '../models/textbook';
import { forkJoin ,  Observable } from 'rxjs';
import { DictNoteService, DictOnlineService } from '../services/dictionary.service';
import { TextbookService } from '../services/textbook.service';
import { AutoCorrectService } from '../services/autocorrect.service';
import { AutoCorrect } from '../models/autocorrect';

const userid = 1;

@Injectable
export class SettingsService {

  userSettings: UserSetting[] = new Array(0);
  private selectedUSUserIndex!: number;
  private get selectedUSUser(): UserSetting {
    return this.userSettings[this.selectedUSUserIndex];
  }
  private get USLANGID(): number {
    return +this.selectedUSUser.VALUE1;
  }
  private set USLANGID(newValue: number) {
    this.selectedUSUser.VALUE1 = newValue;
  }
  private selectedUSLangIndex!: number;
  private get selectedUSLang(): UserSetting {
    return this.userSettings[this.selectedUSLangIndex];
  }
  get USTEXTBOOKID(): number {
    return +this.selectedUSLang.VALUE1;
  }
  set USTEXTBOOKID(newValue: number) {
    this.selectedUSLang.VALUE1 = newValue;
  }
  get USDICTONLINEID(): number {
    return +this.selectedUSLang.VALUE2;
  }
  set USDICTONLINEID(newValue: number) {
    this.selectedUSLang.VALUE2 = newValue;
  }
  get USDICTNOTEID(): number {
    return +this.selectedUSLang.VALUE3;
  }
  set USDICTNOTEID(newValue: number) {
    this.selectedUSLang.VALUE3 = newValue;
  }
  private selectedUSTextbookIndex!: number;
  get selectedUSTextbook(): UserSetting {
    return this.userSettings[this.selectedUSTextbookIndex];
  }
  get USUNITFROM(): number {
    return +this.selectedUSTextbook.VALUE1;
  }
  set USUNITFROM(newValue: number) {
    this.selectedUSTextbook.VALUE1 = newValue;
  }
  get USPARTFROM(): number {
    return +this.selectedUSTextbook.VALUE2;
  }
  set USPARTFROM(newValue: number) {
    this.selectedUSTextbook.VALUE2 = newValue;
  }
  get USUNITTO(): number {
    return +this.selectedUSTextbook.VALUE3;
  }
  set USUNITTO(newValue: number) {
    this.selectedUSTextbook.VALUE3 = newValue;
  }
  get USPARTTO(): number {
    return +this.selectedUSTextbook.VALUE4;
  }
  set USPARTTO(newValue: number) {
    this.selectedUSTextbook.VALUE4 = newValue;
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
  get isInvalidUnitPart(): boolean {
    return this.USUNITPARTFROM > this.USUNITPARTTO;
  }

  languages: Language[] = new Array(0);
  private selectedLangIndex!: number;
  get selectedLang(): Language {
    return this.languages[this.selectedLangIndex];
  }

  dictsOnline: DictOnline[] = new Array(0);
  private _selectedDictOnlineIndex!: number;
  get selectedDictOnlineIndex() {
    return this._selectedDictOnlineIndex;
  }
  set selectedDictOnlineIndex(newValue: number) {
    this._selectedDictOnlineIndex = newValue;
    this.USDICTONLINEID = this.selectedDictOnline.ID;
  }
  get selectedDictOnline(): DictOnline {
    return this.dictsOnline[this._selectedDictOnlineIndex];
  }

  dictsNote: DictNote[] = new Array(0);
  private _selectedDictNoteIndex!: number;
  get selectedDictNoteIndex() {
    return this._selectedDictNoteIndex;
  }
  set selectedDictNoteIndex(newValue: number) {
    this._selectedDictNoteIndex = newValue;
    this.USDICTNOTEID = this.selectedDictNote!.ID;
  }
  get selectedDictNote(): DictNote | null {
    return this.dictsNote.length === 0 ? null : this.dictsNote[this._selectedDictNoteIndex];
  }

  textbooks: Textbook[] = new Array(0);
  private _selectedTextbookIndex!: number;
  get selectedTextbookIndex() {
    return this._selectedTextbookIndex;
  }
  set selectedTextbookIndex(newValue: number) {
    this._selectedTextbookIndex = newValue;
    this.setSelectedTextbookIndex();
  }
  get selectedTextbook(): Textbook {
    return this.textbooks[this._selectedTextbookIndex];
  }

  units: string[] = new Array(0);
  parts: string[] = new Array(0);

  autoCorrects: AutoCorrect[] = new Array(0);

  constructor(@Inject private langService: LanguageService,
              @Inject private userSettingService: UserSettingService,
              @Inject private dictOnlineService: DictOnlineService,
              @Inject private dictNoteService: DictNoteService,
              @Inject private textbookService: TextbookService,
              private autoCorrectService: AutoCorrectService) { }

  getData(): Observable<void> {
    return forkJoin([this.langService.getData(), this.userSettingService.getDataByUser(userid)]).pipe(
      mergeMap(res => {
        this.languages = res[0] as Language[];
        this.userSettings = res[1] as UserSetting[];
        this.selectedUSUserIndex = this.userSettings.findIndex(value => value.KIND === 1);
        return this.setSelectedLangIndex(this.languages.findIndex(value => value.ID === this.USLANGID));
      }));
  }

  setSelectedLangIndex(langindex: number): Observable<void> {
    this.selectedLangIndex = langindex;
    this.USLANGID = this.selectedLang.ID;
    this.selectedUSLangIndex = this.userSettings.findIndex(value => value.KIND === 2 && value.ENTITYID === this.USLANGID);
    return forkJoin([
      this.dictOnlineService.getDataByLang(this.USLANGID),
      this.dictNoteService.getDataByLang(this.USLANGID),
      this.textbookService.getDataByLang(this.USLANGID),
      this.autoCorrectService.getDataByLang(this.USLANGID)]).pipe(
      map(res => {
        this.dictsOnline = res[0] as DictOnline[];
        this.selectedDictOnlineIndex = this.dictsOnline.findIndex(value => value.ID === this.USDICTONLINEID);
        this.dictsNote = res[1] as DictNote[];
        if (this.dictsNote.length > 0) {
          this.selectedDictNoteIndex = this.dictsNote.findIndex(value => value.ID === this.USDICTNOTEID);
        }
        this.textbooks = res[2] as Textbook[];
        this.selectedTextbookIndex = this.textbooks.findIndex(value => value.ID === this.USTEXTBOOKID);
        this.autoCorrects = res[3] as AutoCorrect[];
      }));
  }

  private setSelectedTextbookIndex() {
    this.USTEXTBOOKID = this.selectedTextbook.ID;
    this.selectedUSTextbookIndex = this.userSettings.findIndex(value => value.KIND === 3 && value.ENTITYID === this.USTEXTBOOKID);
    this.units = Array.from(Array(this.selectedTextbook.UNITS).keys()).map(value => String(value + 1));
    this.parts = this.selectedTextbook.PARTS.split(' ');
  }

  updateLang(): Observable<number> {
    return this.userSettingService.updateLang(this.selectedUSUser.ID, this.USLANGID);
  }

  updateTextbook(): Observable<number> {
    return this.userSettingService.updateTextbook(this.selectedUSLang.ID, this.USTEXTBOOKID);
  }

  updateDictOnline(): Observable<number> {
    return this.userSettingService.updateDictOnline(this.selectedUSLang.ID, this.USDICTONLINEID);
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

}
