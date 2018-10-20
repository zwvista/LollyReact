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
import "font-awesome/css/font-awesome.min.css";

import { TabMenu } from 'primereact/tabmenu';
import history from './view-models/history';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';


@Module({
  providers: [
    DictOnlineService, DictOfflineService, DictNoteService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService,
  ],
})
export default class App extends React.Component<any, any> {
  @Inject appService!: AppService;

  constructor(props: any) {
    super(props);
    const items = [
      {label: 'Words in Unit', icon: 'fa fa-bus fa-lg', target: '/words-unit'},
      {label: 'Phrases in Unit', icon: 'fa fa-plane fa-lg', target: '/phrases-unit'},
      {label: 'Settings', icon: 'fa fa-cog fa-lg', target: '/settings'},
    ];
    const activeItem = items.find((value: any) => window.location.href.includes(value.target));
    this.state = {
      items,
      activeItem,
    };
  }

  componentDidMount() {
    console.log(this.appService);
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <h2>Lolly React</h2>
          <div className="content-section implementation">
            <TabMenu model={this.state.items} activeItem={this.state.activeItem} onTabChange={this.handleTabChange} />
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

  handleTabChange = (e: any) => {
    this.setState({activeItem: e.value});
    history.push(e.value.target);
  };

}
