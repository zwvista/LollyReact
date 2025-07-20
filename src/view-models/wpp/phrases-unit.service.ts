import { AppService } from '../misc/app.service';
import { SettingsService } from '../misc/settings.service';
import { MUnitPhrase } from '../../models/wpp/unit-phrase';
import { UnitPhraseService } from '../../services/wpp/unit-phrase.service';
import { LangPhraseService } from '../../services/wpp/lang-phrase.service';
import { singleton } from 'tsyringe';

@singleton()
export class PhrasesUnitService {

  unitPhrases: MUnitPhrase[] = [];

  textbookPhrases: MUnitPhrase[] = [];
  textbookPhraseCount = 0;

  constructor(private unitPhraseService: UnitPhraseService,
              private langPhraseService: LangPhraseService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getDataInTextbook(filter: string, filterType: number) {
    await this.appService.getData();
    this.unitPhrases = await this.unitPhraseService.getDataByTextbookUnitPart(this.settingsService.selectedTextbook,
        this.settingsService.USUNITPARTFROM, this.settingsService.USUNITPARTTO, filter, filterType);
  }

  async getDataInLang(page: number, rows: number, filter: string, filterType: number, textbookFilter: number) {
    await this.appService.getData();
    const res = await this.unitPhraseService.getDataByLang(this.settingsService.selectedLang.ID,
        this.settingsService.textbooks, filter, filterType, textbookFilter, page, rows);
    this.textbookPhrases = res.records;
    this.textbookPhraseCount = res.results;
  }

  async create(item: MUnitPhrase): Promise<number | any[]> {
    return await this.unitPhraseService.create(item);
  }

  async updateSeqNum(id: number, seqnum: number): Promise<number> {
    return await this.unitPhraseService.updateSeqNum(id, seqnum);
  }

  async updateTranslation(phraseid: number, translation: string): Promise<number> {
    return await this.langPhraseService.updateTranslation(phraseid, translation);
  }

  async update(item: MUnitPhrase): Promise<string> {
    return await this.unitPhraseService.update(item);
  }

  async delete(item: MUnitPhrase): Promise<string> {
    return await this.unitPhraseService.delete(item);
  }

  async reindex(onNext: (index: number) => void) {
    for (let i = 1; i <= this.unitPhrases.length; i++) {
      const item = this.unitPhrases[i - 1];
      if (item.SEQNUM === i) continue;
      item.SEQNUM = i;
      await this.unitPhraseService.updateSeqNum(item.ID, item.SEQNUM);
      onNext(i - 1);
    }
  }

  newUnitPhrase(): MUnitPhrase {
    const o = new MUnitPhrase();
    o.LANGID = this.settingsService.selectedLang.ID;
    o.TEXTBOOKID = this.settingsService.USTEXTBOOK;
    const maxElem = this.unitPhrases.length === 0 ? null :
      this.unitPhrases.reduce((p, v) => p.unitPartSeqnum < v.unitPartSeqnum ? v : p);
    o.UNIT = maxElem ? maxElem.UNIT : this.settingsService.USUNITTO;
    o.PART = maxElem ? maxElem.PART : this.settingsService.USPARTTO;
    o.SEQNUM = (maxElem ? maxElem.SEQNUM : 0) + 1;
    o.textbook = this.settingsService.selectedTextbook;
    return o;
  }

}
