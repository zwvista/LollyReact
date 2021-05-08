import { Inject, Injectable } from 'react.di';
import { ReplaySubject } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable
export class AppService {

  private _initializeObject: ReplaySubject<void> = new ReplaySubject<void>();
  get initializeObject() {
    return this._initializeObject.asObservable();
  }

  isInitialized = false;

  constructor(@Inject private settingsService: SettingsService) {
  }

  getData() {
    this.settingsService.getData().subscribe(_ => {
      this.isInitialized = true;
      this._initializeObject.next(null);
    });
  }

}
