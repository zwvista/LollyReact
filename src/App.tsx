import * as React from 'react';
import './App.css';

import { Router, Route, Switch } from 'react-router-dom'

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

import WordsUnit from './components/WordsUnit';
import PhrasesUnit from './components/PhrasesUnit';
import Settings from './components/Settings';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { TabMenu } from 'primereact/tabmenu';
import { MenuItem } from 'primereact/api';
import history from './view-models/history';


@Module({
  providers: [
    DictOnlineService, DictOfflineService, DictNoteService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService,
  ],
})
export default class App extends React.Component<{}, {items: MenuItem[], activeItem: MenuItem | null}> {
  @Inject appService!: AppService;

  constructor(props: {}) {
    super(props);
    this.state = {
      items: [
        {label: 'Words in Unit', icon: 'pi pi-fw pi-pencil', target: '/words-unit'},
        {label: 'Phrases in Unit', icon: 'pi pi-fw pi-calendar', target: '/phrases-unit'},
        {label: 'Settings', icon: 'pi pi-fw pi-cog', target: '/settings'},
      ],
      activeItem: null
    };
  }

  componentDidMount() {
    console.log(this.appService);
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <div className="content-section implementation">
            <TabMenu model={this.state.items} activeItem={this.state.activeItem} onTabChange={this.onTabChange} />
          </div>
          <Switch>
            <Route path="/" component={WordsUnit} exact />
            <Route path="/phrases-unit" component={PhrasesUnit} exact />
            <Route path="/phrases-unit-detail/:id" component={PhrasesUnit} exact />
            <Route path="/words-unit" component={WordsUnit} exact />
            <Route path="/words-unit-detail/:id" component={WordsUnit} exact />
            <Route path="/words-dict/:index" component={WordsUnit} exact />
            <Route path="/settings" component={Settings} exact />
          </Switch>
        </div>
      </Router>
    );
  }

  onTabChange = (e: { originalEvent: Event, value: any}) => {
    this.setState({activeItem: e.value});
    history.push(e.value.target);
  };

}
