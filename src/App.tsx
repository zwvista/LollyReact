import * as React from 'react';
import './App.css';

import { Link, Route, Router, Switch } from 'react-router-dom'
import { AppBar, Tab, Tabs } from '@material-ui/core';

import { Inject, Module } from 'react.di';
import { WordsUnitService } from './view-models/words-unit.service';
import { AppService } from './view-models/app.service';
import { UserSettingService } from './services/user-setting.service';
import { DictReferenceService, DictNoteService, DictTranslationService } from './services/dictionary.service';
import { TextbookService } from './services/textbook.service';
import { HtmlService } from './services/html.service';
import { PhrasesUnitService } from './view-models/phrases-unit.service';
import { UnitPhraseService } from './services/unit-phrase.service';
import { LanguageService } from './services/language.service';
import { UnitWordService } from './services/unit-word.service';
import { SettingsService } from './view-models/settings.service';

import WordsUnit from './components/WordsUnit';
import WordsUnitDetail from './components/WordsUnitDetail';
import WordsDict from './components/WordsDict';
import PhrasesUnit from './components/PhrasesUnit';
import PhrasesUnitDetail from './components/PhrasesUnitDetail';
import Settings from './components/Settings';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "font-awesome/css/font-awesome.min.css";
import "primeflex/primeflex.css"

import { TabMenu } from 'primereact/tabmenu';
import history from './view-models/history';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AutoCorrectService } from './services/autocorrect.service';
import { LangPhraseService } from './services/lang-phrase.service';
import { LangWordService } from './services/lang-word.service';
import { WordsLangService } from './view-models/words-lang.service';
import { PhrasesLangService } from './view-models/phrases-lang.service';
import WordsLang from './components/WordsLang';
import PhrasesLangDetail from './components/PhrasesLangDetail';
import WordsLangDetail from './components/WordsLangDetail';
import PhrasesLang from './components/PhrasesLang';
import { NoteService } from './view-models/note.service';
import WordsTextbook from './components/WordsTextbook';
import WordsTextbookDetail from './components/WordsTextbookDetail';
import PhrasesTextbookDetail from './components/PhrasesTextbookDetail';
import PhrasesTextbook from './components/PhrasesTextbook';
import { VoicesService } from './services/voices.service';
import { WordFamiService } from './services/word-fami.service';
import { WordsFamiService } from './view-models/words-fami.service';
import WordsUnit2 from './components/WordsUnit2';
import PhrasesUnit2 from './components/PhrasesUnit2';
import WordsLang2 from './components/WordsLang2';
import PhrasesTextbook2 from './components/PhrasesTextbook2';
import PhrasesLang2 from './components/PhrasesLang2';
import WordsTextbook2 from './components/WordsTextbook2';

// https://stackoverflow.com/questions/53375964/using-a-link-component-with-listitem-and-typescript
// https://stackoverflow.com/questions/51257426/how-do-you-get-material-ui-tabs-to-work-with-react-router
function LinkTab(props: any) {
  return <Tab component={Link} {...props} />;
}

@Module({
  providers: [
    DictReferenceService, DictNoteService, DictTranslationService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
    LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
    NoteService, WordFamiService, WordsFamiService,
    VoicesService,
  ],
})
export default class App extends React.Component<any, any> {
  @Inject appService!: AppService;

  constructor(props: any) {
    super(props);
    const items = [
      {label: 'Words in Unit', icon: 'fa fa-bus fa-lg', target: '/words-unit'},
      {label: 'Phrases in Unit', icon: 'fa fa-bus fa-lg', target: '/phrases-unit'},
      {label: 'Words in Language', icon: 'fa fa-plane fa-lg', target: '/words-lang'},
      {label: 'Phrases in Language', icon: 'fa fa-plane fa-lg', target: '/phrases-lang'},
      {label: 'Words in Textbook', icon: 'fa fa-taxi fa-lg', target: '/words-textbook'},
      {label: 'Phrases in Textbook', icon: 'fa fa-taxi fa-lg', target: '/phrases-textbook'},
      {label: 'Settings', icon: 'fa fa-cog fa-lg', target: '/settings'},
    ];
    const items2 = [
      {label: 'Words in Unit', icon: 'fa fa-bus fa-lg', target: '/words-unit2'},
      {label: 'Phrases in Unit', icon: 'fa fa-bus fa-lg', target: '/phrases-unit2'},
      {label: 'Words in Language', icon: 'fa fa-plane fa-lg', target: '/words-lang2'},
      {label: 'Phrases in Language', icon: 'fa fa-plane fa-lg', target: '/phrases-lang2'},
      {label: 'Words in Textbook', icon: 'fa fa-taxi fa-lg', target: '/words-textbook2'},
      {label: 'Phrases in Textbook', icon: 'fa fa-taxi fa-lg', target: '/phrases-textbook2'},
      {label: 'Settings', icon: 'fa fa-cog fa-lg', target: '/settings'},
    ];
    const activeItem = items.find((value: any) => window.location.href.includes(value.target));
    this.state = {
      items,
      items2,
      activeItem,
      value: 0,
      valueApp: 0,
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
          <AppBar position="static" color="default">
            <Tabs value={this.state.valueApp} onChange={this.onTabAppChange} indicatorColor="primary" textColor="primary">
              <Tab label="App1" />
              <Tab label="App2" />
            </Tabs>
          </AppBar>
          {this.state.valueApp === 0 && <div className="content-section implementation">
            <TabMenu model={this.state.items} activeItem={this.state.activeItem} onTabChange={this.onTabChange} />
          </div>}
          {this.state.valueApp === 1 && <AppBar position="static" color="default">
            <Tabs value={this.state.value} onChange={this.onTab2Change} indicatorColor="primary" textColor="primary">
              {this.state.items2.map((row: any) =>
                <LinkTab key={row.label} label={row.label} to={row.target} />
              )}
            </Tabs>
          </AppBar>}
          <Switch>
            <Route path="/" component={WordsUnit} exact />
            <Route path="/words-unit" component={WordsUnit} exact />
            <Route path="/words-unit2" component={WordsUnit2} exact />
            <Route path="/words-unit-detail/:id" component={WordsUnitDetail} exact />
            <Route path="/phrases-unit" component={PhrasesUnit} exact />
            <Route path="/phrases-unit2" component={PhrasesUnit2} exact />
            <Route path="/phrases-unit-detail/:id" component={PhrasesUnitDetail} exact />
            <Route path="/words-lang" component={WordsLang} exact />
            <Route path="/words-lang2" component={WordsLang2} exact />
            <Route path="/words-lang-detail/:id" component={WordsLangDetail} exact />
            <Route path="/phrases-lang" component={PhrasesLang} exact />
            <Route path="/phrases-lang2" component={PhrasesLang2} exact />
            <Route path="/phrases-lang-detail/:id" component={PhrasesLangDetail} exact />
            <Route path="/words-textbook" component={WordsTextbook} exact />
            <Route path="/words-textbook2" component={WordsTextbook2} exact />
            <Route path="/words-textbook-detail/:id" component={WordsTextbookDetail} exact />
            <Route path="/phrases-textbook" component={PhrasesTextbook} exact />
            <Route path="/phrases-textbook2" component={PhrasesTextbook2} exact />
            <Route path="/phrases-textbook-detail/:id" component={PhrasesTextbookDetail} exact />
            <Route path="/words-dict/:type/:index" component={WordsDict} exact />
            <Route path="/settings" component={Settings} exact />
          </Switch>
        </div>
      </Router>
    );
  }

  onTabChange = (e: any) => {
    this.setState({activeItem: e.value});
    history.push(e.value.target);
  };

  onTab2Change = (event: any, value: any) => {
    this.setState({value});
  };

  onTabAppChange = (event: any, valueApp: any) => {
    let index = this.state.valueApp === 0 ? this.state.items.indexOf(this.state.activeItem) : this.state.value;
    if (index === -1) index = 0;
    this.setState({valueApp});
    if (valueApp === 0)
      this.setState({activeItem: this.state.items[index]});
    else
      this.setState({value: index});
  };

}
