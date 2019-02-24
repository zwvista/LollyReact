import { Inject, Injectable } from 'react.di';
import { ReplaySubject } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable
export class AppService {

  private _initializeComplete: ReplaySubject<void> = new ReplaySubject<void>();
  get initializeComplete() {
    return this._initializeComplete.asObservable();
  }

  isInitialized = false;

  constructor(@Inject private settingsService: SettingsService) {
    settingsService.getData().subscribe(_ => {
      this.isInitialized = true;
      this._initializeComplete.next(undefined);
    });
  }

}
