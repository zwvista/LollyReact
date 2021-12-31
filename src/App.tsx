import * as React from 'react';
import './App.css';

import {Link, Outlet} from 'react-router-dom'
import { AppBar, Tab, Tabs } from '@material-ui/core';

import { Inject, Module } from 'react.di';
import { WordsUnitService } from './view-models/wpp/words-unit.service';
import { AppService } from './view-models/misc/app.service';
import { UserSettingService } from './services/misc/user-setting.service';
import { DictionaryService } from './services/misc/dictionary.service';
import { TextbookService } from './services/misc/textbook.service';
import { HtmlService } from './services/misc/html.service';
import { PhrasesUnitService } from './view-models/wpp/phrases-unit.service';
import { UnitPhraseService } from './services/wpp/unit-phrase.service';
import { LanguageService } from './services/misc/language.service';
import { UnitWordService } from './services/wpp/unit-word.service';
import { SettingsService } from './view-models/misc/settings.service';

import Settings from './components/misc/Settings';

import 'primereact/resources/themes/nova/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "font-awesome/css/font-awesome.min.css";
import "primeflex/primeflex.css"

import { TabMenu } from 'primereact/tabmenu';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

import { AutoCorrectService } from './services/misc/autocorrect.service';
import { LangPhraseService } from './services/wpp/lang-phrase.service';
import { LangWordService } from './services/wpp/lang-word.service';
import { WordsLangService } from './view-models/wpp/words-lang.service';
import { PhrasesLangService } from './view-models/wpp/phrases-lang.service';
import { VoiceService } from './services/misc/voice.service';
import { WordFamiService } from './services/wpp/word-fami.service';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faEuroSign, faBus, faTrain, faPlane, faRocket, faCar, faTaxi, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UsMappingService } from './services/misc/us-mapping.service';
import { PatternService } from './services/wpp/pattern.service';
import { PatternsService } from './view-models/wpp/patterns.service';
import { GlobalVars } from './common/common';
import { UserService } from './services/misc/user.service';
import { LoginService } from './view-models/misc/login.service';
import Login from './components/misc/Login';

// https://stackoverflow.com/questions/53375964/using-a-link-component-with-listitem-and-typescript
// https://stackoverflow.com/questions/51257426/how-do-you-get-material-ui-tabs-to-work-with-react-router
function LinkTab(props: any) {
  return <Tab component={Link} {...props} />;
}

@Module({
  providers: [
    DictionaryService, HtmlService, LanguageService,
    TextbookService, UnitPhraseService, UnitWordService, UserSettingService, AppService,
    PhrasesUnitService, SettingsService, WordsUnitService, AutoCorrectService,
    LangPhraseService, LangWordService, PhrasesLangService, WordsLangService,
    WordFamiService, VoiceService, UsMappingService, PatternService, PatternsService,
    UserService, LoginService
  ],
})
export default class App extends React.Component<any, any> {
  @Inject appService!: AppService;

  constructor(props: any) {
    super(props);
    library.add(faDollarSign, faEuroSign, faBus, faTrain, faPlane, faRocket, faCar, faTaxi, faCog);
    const items = [
      {label: 'Words in Unit', icon: 'fa fa-bus fa-lg', target: '/words-unit'},
      {label: 'Phrases in Unit', icon: 'fa fa-train fa-lg', target: '/phrases-unit'},
      {label: 'Words in Textbook', icon: 'fa fa-car fa-lg', target: '/words-textbook'},
      {label: 'Phrases in Textbook', icon: 'fa fa-taxi fa-lg', target: '/phrases-textbook'},
      {label: 'Words in Language', icon: 'fa fa-plane fa-lg', target: '/words-lang'},
      {label: 'Phrases in Language', icon: 'fa fa-rocket fa-lg', target: '/phrases-lang'},
      {label: 'Patterns in Language', icon: 'fa fa-motorcycle fa-lg', target: '/patterns'},
      {label: 'Settings', icon: 'fa fa-gear fa-lg', target: '/settings'},
    ];
    const items2 = [
      {label: 'Words in Unit', icon: 'bus', target: '/words-unit2'},
      {label: 'Phrases in Unit', icon: 'train', target: '/phrases-unit2'},
      {label: 'Words in Textbook', icon: 'car', target: '/words-textbook2'},
      {label: 'Phrases in Textbook', icon: 'taxi', target: '/phrases-textbook2'},
      {label: 'Words in Language', icon: 'plane', target: '/words-lang2'},
      {label: 'Phrases in Language', icon: 'rocket', target: '/phrases-lang2'},
      {label: 'Patterns in Language', icon: 'motorcycle', target: '/patterns2'},
      {label: 'Settings', icon: 'cog', target: '/settings'},
    ];
    // const activeIndex = items.find((value: any) => window.location.href.includes(value.target));
    this.state = {
      items,
      items2,
      activeIndex: 0,
      value: 0,
      valueApp: 0,
    };
  }

  componentDidMount() {
    console.log(this.appService);
  }

  render() {
    const loggedIn = localStorage.getItem('userid');
    if (!loggedIn)
      return (<Login />);

    GlobalVars.userid = loggedIn!;
    this.appService.getData();
    return (
      <div className="App">
        <h2>Lolly React</h2>
        <AppBar position="static" color="default">
          <Tabs value={this.state.valueApp} onChange={this.onTabAppChange} indicatorColor="primary" textColor="primary">
            <Tab label={<span><FontAwesomeIcon icon="dollar-sign" size="lg"/> App1</span>} />
            <Tab label={<span><FontAwesomeIcon icon="euro-sign" size="lg"/> App2</span>} />
          </Tabs>
        </AppBar>
        {this.state.valueApp === 0 && <div className="content-section implementation">
          <TabMenu model={this.state.items} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} />
        </div>}
        {this.state.valueApp === 1 && <AppBar position="static" color="default">
          <Tabs value={this.state.value} onChange={this.onTab2Change} indicatorColor="primary" textColor="primary">
            {this.state.items2.map((row: any) =>
              <LinkTab key={row.label} label={<span><FontAwesomeIcon icon={row.icon} size="lg"/> {row.label}</span>} to={row.target} />
            )}
          </Tabs>
        </AppBar>}
        <Outlet/>
      </div>
    );
  }

  onTabChange = (e: any) => {
    this.setState({activeItem: e.value});
    // this.props.history.push(e.value.target);
  };

  onTab2Change = (event: any, value: any) => {
    this.setState({value});
  };

  onTabAppChange = (event: any, valueApp: any) => {
    let index = this.state.valueApp === 0 ? this.state.items.indexOf(this.state.activeItem) : this.state.value;
    if (index === -1) index = 0;
    this.setState({valueApp});
    if (valueApp === 0) {
      this.setState({activeIndex: index});
      // this.props.history.push(this.state.items[index].target);
    } else {
      this.setState({value: index});
      // this.props.history.push(this.state.items2[index].target);
    }
  };

}
