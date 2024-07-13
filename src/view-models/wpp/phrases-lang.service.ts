import { LangPhraseService } from '../../services/wpp/lang-phrase.service';
import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { take } from 'rxjs/operators';
import { MLangPhrase } from '../../models/wpp/lang-phrase';
import { singleton } from "tsyringe";

@singleton()
export class PhrasesLangService {

  langPhrases: MLangPhrase[] = [];
  langPhraseCount = 0;

  constructor(private langPhraseService: LangPhraseService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getData(page: number, rows: number, filter: string, filterType: number) {
    await this.appService.initializeObject.pipe(take(1));
    const res = await this.langPhraseService.getDataByLang(this.settingsService.selectedLang.ID, page, rows, filter, filterType);
    this.langPhrases = res.records;
    this.langPhraseCount = res.results;
  }

  async create(item: MLangPhrase): Promise<number | any[]> {
    return await this.langPhraseService.create(item);
  }

  async update(item: MLangPhrase): Promise<number> {
    return await this.langPhraseService.update(item);
  }

  async delete(item: MLangPhrase): Promise<string> {
    return await this.langPhraseService.delete(item);
  }

  newLangPhrase(): MLangPhrase {
    const o = new MLangPhrase();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }
}
