import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { LangWordService } from '../../services/wpp/lang-word.service';
import { MLangWord } from '../../models/wpp/lang-word';
import { WordFamiService } from '../../services/wpp/word-fami.service';
import { singleton } from 'tsyringe';

@singleton()
export class WordsLangService {

  langWords: MLangWord[] = [];
  langWordsCount = 0;

  constructor(private langWordService: LangWordService,
              private wordFamiService: WordFamiService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getData(page: number, rows: number, filter: string, filterType: number): Promise<void> {
    await this.appService.getData();
    const res =　await this.langWordService.getDataByLang(this.settingsService.selectedLang.ID, page, rows, filter, filterType);
    this.langWords = res.records;
    this.langWordsCount = res.results;
  }

  async create(item: MLangWord): Promise<number | any[]> {
    return await this.langWordService.create(item);
  }

  async updateNote(id: number, note: string): Promise<number> {
    return await this.langWordService.updateNote(id, note);
  }

  async update(item: MLangWord): Promise<number> {
    return await this.langWordService.update(item);
  }

  async delete(item: MLangWord): Promise<string> {
    return await this.langWordService.delete(item);
  }

  newLangWord(): MLangWord {
    const o = new MLangWord();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }

  async getNote(index: number): Promise<number> {
    const item = this.langWords[index];
    const note = await this.settingsService.getNote(item.WORD);
    item.NOTE = note;
    return await this.updateNote(item.ID, note);
  }
}
