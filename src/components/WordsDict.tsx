import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import './Common.css'
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { SettingsService } from '../view-models/settings.service';
import DictBrowser from './DictBrowser';
import { ListBox } from 'primereact/listbox';
import { DictOnline } from '../models/dictionary';
import { HtmlService } from '../services/html.service';

export default class WordsDict extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  @Inject htmlService: HtmlService;

  componentDidMount() {
    const words = this.wordsUnitService.unitWords.map(v  => ({label: v.WORD, value: v.WORD}));
    const selectedWord = words[+this.props.match.params.index].value;
    const selectedDictOnline = this.settingsService.selectedDictOnline;
    this.setState({
      words,
      selectedWord,
      dictUrl: 'about:blank',
      selectedDictOnline,
    });
    if (selectedWord) this.refreshDict(selectedDictOnline, selectedWord);
  }

  render() {
    return this.state && (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Back" onClick={this.goBack} />
            <Dropdown className="p-col-2" options={this.settingsService.dictsOnline} value={this.state.selectedDictOnline}
                optionLabel="DICTNAME" onChange={this.onDictChange} />
          </div>
        </Toolbar>
        <div className="p-grid">
          <ListBox className="p-col-2" listStyle={{'max-height':'480px'}} options={this.state.words}
                   value={this.state.selectedWord} onChange={this.onWordChange} />
          <div className="p-col-10">
            <DictBrowser url={this.state.dictUrl} htmlString={this.state.dictSrc} />
          </div>
        </div>
      </div>
    );
  }

  goBack = () => {
    history.back();
  };

  onDictChange = (e: any) => {
    const selectedDictOnline = e.value;
    this.setState({
      selectedDictOnline,
    });
    this.refreshDict(selectedDictOnline, this.state.selectedWord);
  };

  onWordChange = (e: any) => {
    const selectedWord = e.value;
    this.setState({
      selectedWord,
    });
    this.refreshDict(this.state.selectedDictOnline, selectedWord);
  };

  refreshDict(selectedDictOnline: DictOnline, selectedWord: string) {
    const url = selectedDictOnline.urlString(selectedWord, this.settingsService.autoCorrects);
    if (selectedDictOnline.DICTTYPENAME === 'OFFLINE') {
      this.setState({
        dictUrl: 'about:blank',
      });
      this.htmlService.getHtml(url).subscribe(html => {
        const dictSrc = selectedDictOnline.htmlString(html, selectedWord)
          .replace(/\n/g, ' ').replace(/"/g, '&quot;');
        console.log(dictSrc);
        this.setState({
          dictSrc,
        });
      });
    } else {
      this.setState({
        dictSrc: null,
        dictUrl: url,
      });
    }
  };

  onload(event: Event) {
    const iFrame = event.target as HTMLIFrameElement;
    console.log(iFrame);
    const iFrameBody = iFrame.contentWindow.document.body.innerHTML;
    // if ( iFrame.contentDocument ) { // FF
    //   iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
    // } else if ( iFrame.contentWindow ) { // IE
    //   iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
    // }
    console.log(iFrameBody);
  }

};

