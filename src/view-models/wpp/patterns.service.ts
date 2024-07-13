import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { MPattern } from '../../models/wpp/pattern';
import { take } from 'rxjs/operators';
import { PatternService } from '../../services/wpp/pattern.service';
import { singleton } from "tsyringe";

@singleton()
export class PatternsService {

  patterns: MPattern[] = [];
  patternCount = 0;

  constructor(private patternService: PatternService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getData(page: number, rows: number, filter: string, filterType: number) {
    await this.appService.initializeObject.pipe(take(1));
    const res = await this.patternService.getDataByLang(this.settingsService.selectedLang.ID, page, rows, filter, filterType);
    this.patterns = res.records;
    this.patternCount = res.results;
  }

  async create(item: MPattern): Promise<number | any[]> {
    return await this.patternService.create(item);
  }

  async update(item: MPattern): Promise<number> {
    return await this.patternService.update(item);
  }

  async delete(id: number): Promise<number> {
    return await this.patternService.delete(id);
  }

  newPattern(): MPattern {
    const o = new MPattern();
    o.LANGID = this.settingsService.selectedLang.ID;
    return o;
  }
}
