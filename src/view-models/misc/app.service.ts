import { SettingsService } from './settings.service';
import { singleton } from 'tsyringe';

@singleton()
export class AppService {

  isInitialized = false;

  constructor(private settingsService: SettingsService) {
  }

  async getData() {
    if (!this.isInitialized) {
      await this.settingsService.getData();
      this.isInitialized = true;
    }
  }
}
