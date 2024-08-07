import { UnitWordService } from '../../services/wpp/unit-word.service';
import { SettingsService } from '../misc/settings.service';
import { MUnitWord } from '../../models/wpp/unit-word';
import { AppService } from '../misc/app.service';
import { take } from 'rxjs/operators';
import { LangWordService } from '../../services/wpp/lang-word.service';
import { singleton } from "tsyringe";

@singleton()
export class WordsUnitService {

  unitWords: MUnitWord[] = [];

  textbookWords: MUnitWord[] = [];
  textbookWordCount = 0;

  constructor(private unitWordService: UnitWordService,
              private langWordService: LangWordService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getDataInTextbook(filter: string, filterType: number): Promise<void> {
    await this.appService.initializeObject.pipe(take(1));
    this.unitWords = await this.unitWordService.getDataByTextbookUnitPart(this.settingsService.selectedTextbook,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO, filter, filterType);
  }

  async getDataInLang(page: number, rows: number, filter: string, filterType: number, textbookFilter: number) {
    await this.appService.initializeObject.pipe(take(1));
    const res = await this.unitWordService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, page, rows, filter, filterType, textbookFilter);
    this.textbookWords = res.records;
    this.textbookWordCount = res.results;
  }

  async create(item: MUnitWord): Promise<number | any[]> {
    return await this.unitWordService.create(item);
  }

  async updateSeqNum(id: number, seqnum: number): Promise<number> {
    return await this.unitWordService.updateSeqNum(id, seqnum);
  }

  async updateNote(wordid: number, note: string): Promise<number> {
    return await this.langWordService.updateNote(wordid, note);
  }

  async update(item: MUnitWord): Promise<string> {
    return await this.unitWordService.update(item);
  }

  async delete(item: MUnitWord): Promise<string> {
    return await this.unitWordService.delete(item);
  }

  async reindex(onNext: (index: number) => void) {
    for (let i = 1; i <= this.unitWords.length; i++) {
      const item = this.unitWords[i - 1];
      if (item.SEQNUM === i) continue;
      item.SEQNUM = i;
      await this.unitWordService.updateSeqNum(item.ID, item.SEQNUM);
      onNext(i - 1);
    }
  }

  newUnitWord(): MUnitWord {
    const o = new MUnitWord();
    o.LANGID = this.settingsService.selectedLang.ID;
    o.TEXTBOOKID = this.settingsService.USTEXTBOOK;
    const maxElem = this.unitWords.length === 0 ? null :
      this.unitWords.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    o.textbook = this.settingsService.selectedTextbook;
    return o;
  }

  async getNote(index: number) {
    const item = this.unitWords[index];
    item.NOTE = await this.settingsService.getNote(item.WORD);
    await this.updateNote(item.WORDID, item.NOTE);
  }

  getNotes(ifEmpty: boolean, oneComplete: (index: number) => void, allComplete: () => void) {
    this.settingsService.getNotes(this.unitWords.length,
      i => !ifEmpty || !this.unitWords[i],
      async i => { await this.getNote(i); oneComplete(i);
      }, allComplete);
  }
}
