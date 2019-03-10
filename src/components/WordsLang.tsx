import * as React from 'react';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { WordsLangService } from '../view-models/words-lang.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { PageState, Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../view-models/settings.service';
import * as $ from "jquery";
import { MWordColor } from '../models/word-color';

export default class WordsLang extends React.Component<any, any> {
  @Inject wordsLangService: WordsLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
    first: 0,
    rows: this.settingsService.USROWSPERPAGE,
    page: 1,
    selectedRow: null as any,
  };

  componentDidMount() {
    this.onRefresh(this.state.page);
  }

  onPageChange = (e: PageState) => {
    this.setState({
      first: e.first,
      rows: e.rows,
      page: e.page + 1,
    });
    this.onRefresh(e.page + 1);
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/words-lang-detail/' + rowData.ID)} />
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-arrow-up" tooltipOptions={{position: 'top'}}
              tooltip="Level Up" onClick={() => this.updateLevel(rowData.ID, 1)} />
      <Button icon="fa fa-arrow-down" tooltipOptions={{position: 'top'}}
              tooltip="Level Down" onClick={() => this.updateLevel(rowData.ID, -1)} />
      <Button hidden={!this.settingsService.selectedDictNote} label="Retrieve Note" onClick={() => this.getNote(rowData.ID)} />
      <Button icon="fa fa-google" onClick={() => this.googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => this.dictMean(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <span className="p-float-label">
              <InputText id="float-input" type="text" value={this.state.newWord}
                         onChange={this.onNewWordChange} onKeyPress={this.onNewWordKeyPress}/>
              <label htmlFor="float-input">New Word</label>
              <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/words-lang-detail/0')} />
              <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh(this.state.page)}/>
              <Button label="Dictionary" icon="fa fa-book" onClick={() => history.push('/words-dict/lang/0')} />
            </span>
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.wordsLangService.langWordsCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.wordsLangService.langWords} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column field="LEVEL" header="LEVEL" />
          <Column style={{width:'30%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  onNewWordChange = (e: SyntheticEvent) => {
    this.setState({newWord: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onNewWordKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !this.state.newWord) return;
    const o = this.wordsLangService.newLangWord();
    o.WORD = this.settingsService.autoCorrectInput(this.state.newWord);
    this.setState({newWord: ''});
    this.updateServiceState();
    this.subscription.add(this.wordsLangService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsLangService.langWords.push(o);
    }));
  };

  // Here we have to use JQuery to set td styles based on row number,
  // as PrimeReact DataTable has no rowStyle attribute.
  setRowStyle(o: MWordColor, tr: any) {
    const c = o.colorStyle;
    if (c['background-color'])
      $(tr).css('background-color', c['background-color']).css('color', c['color']);
    else
      $(tr).css('background-color', '').css('color', '');
  }

  onRefresh = (page: number) => {
    this.subscription.add(this.wordsLangService.getData(page, this.state.rows).subscribe(_ => {
      this.updateServiceState();
      const self = this;
      $("tr").each((i, tr) => {
        if (i === 0) return;
        this.setRowStyle(this.wordsLangService.langWords[i - 1], tr);
      });
    }));
  };

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

  deleteWord(index: number) {
    console.log(index);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsLangService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  updateLevel(ID: number, delta: number) {
    const i = this.wordsLangService.langWords.findIndex(v => v.ID === ID);
    const o = this.wordsLangService.langWords[i];
    this.settingsService.updateLevel(o, o.ID, delta).subscribe(_ => this.setRowStyle(o, $('tr').eq(i + 1)));
  }

  speak(word: string) {
    this.settingsService.speech.speak({
      text: word,
      queue: false,
    });
  }

  dictMean(ID: number) {
    const index = this.wordsLangService.langWords.findIndex(value => value.ID === ID);
    history.push('/words-dict/lang/' + index);
  }

  updateServiceState() {
    this.setState({wordsLangService: this.wordsLangService});
  }
};

