import * as React from 'react';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import { container } from "tsyringe";
import './Common.css'
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { SettingsService } from '../../view-models/misc/settings.service';
import DictBrowser from './DictBrowser';
import { ListBox } from 'primereact/listbox';
import { MDictionary } from '../../models/misc/dictionary';
import { HtmlService } from '../../services/misc/html.service';
import { WordsLangService } from '../../view-models/wpp/words-lang.service';

export default class WordsDict extends React.Component<any, any> {
  wordsUnitService = container.resolve(WordsUnitService);
  wordsLangService = container.resolve(WordsLangService);
  settingsService = container.resolve(SettingsService);
  htmlService = container.resolve(HtmlService);

  componentDidMount() {
    const dictType = this.props.match.params.type;
    const words =
      dictType === 'unit' ? this.wordsUnitService.unitWords.map(v  => ({label: v.WORD, value: v.WORD})) :
      dictType === 'textbook' ? this.wordsUnitService.textbookWords.map(v  => ({label: v.WORD, value: v.WORD})) :
      this.wordsLangService.langWords.map(v  => ({label: v.WORD, value: v.WORD}));
    const selectedWord = words[+this.props.match.params.index].value;
    const selectedDictReference = this.settingsService.selectedDictReference;
    this.setState({
      words,
      selectedWord,
      dictUrl: 'about:blank',
      selectedDictReference,
    });
    if (selectedWord) this.refreshDict(selectedDictReference, selectedWord);
  }

  render() {
    return this.state && (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Back" onClick={this.goBack} />
            <Dropdown className="p-col-2" options={this.settingsService.dictsReference} value={this.state.selectedDictReference}
                optionLabel="DICTNAME" onChange={this.onDictChange} />
          </div>
        </Toolbar>
        <div className="grid">
          <ListBox className="p-col-2" listStyle={{'maxHeight':'480px'}} options={this.state.words}
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
    const selectedDictReference = e.value;
    this.setState({
      selectedDictReference,
    });
    this.refreshDict(selectedDictReference, this.state.selectedWord);
  };

  onWordChange = (e: any) => {
    const selectedWord = e.value;
    this.setState({
      selectedWord,
    });
    this.refreshDict(this.state.selectedDictReference, selectedWord);
  };

  async refreshDict(selectedDictReference: MDictionary, selectedWord: string) {
    const item = selectedDictReference;
    const url = item.urlString(selectedWord, this.settingsService.autoCorrects);
    if (item.DICTTYPENAME === 'OFFLINE') {
      this.setState({
        dictUrl: 'about:blank',
      });
      const html = await this.htmlService.getHtml(url)
      const dictSrc = item.htmlString(html, selectedWord)
        .replace(/\n/g, ' ').replace(/"/g, '&quot;');
      console.log(dictSrc);
      this.setState({
        dictSrc,
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

