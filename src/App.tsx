import * as React from 'react';
import './App.css';

import logo from './logo.svg';
import { Inject, Module } from 'react.di';
import { WordsUnitService } from './view-models/words-unit.service';
import { AppService } from './view-models/app.service';
import { UserSettingService } from './services/user-setting.service';
import { DictNoteService, DictOfflineService, DictOnlineService } from './services/dictionary.service';
import { TextbookService } from './services/textbook.service';
import { HtmlService } from './services/html.service';
import { PhrasesUnitService } from './view-models/phrases-unit.service';
import { UnitPhraseService } from './services/unit-phrase.service';
import { LanguageService } from './services/language.service';
import { UnitWordService } from './services/unit-word.service';
import { SettingsService } from './view-models/settings.service';

@Module({
  providers: [
    DictOnlineService, DictOfflineService, DictNoteService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService,
  ],
})
class App extends React.Component {
  @Inject appService!: AppService;

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
