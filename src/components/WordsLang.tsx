import * as React from 'react';
import { WordsLangService } from '../view-models/words-lang.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { interval, Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { KeyboardEvent, SyntheticEvent } from 'react';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../view-models/settings.service';

export default class WordsLang extends React.Component<any, any> {
  @Inject wordsLangService: WordsLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
  };

  componentDidMount() {
    this.subscription.add(this.wordsLangService.getData().subscribe(
      _ => this.updateServiceState()
    ));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/words-lang-detail/' + rowData.ID)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button label="Google Word" onClick={() => this.googleWord(rowData.WORD)} />
      <Button label="Dictionary" onClick={() => this.dictMean(rowData.ID)} />
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/words-lang-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" />
            <Button label="Dictionary" onClick={() => history.push('/words-dict/0')} />
          </div>
        </Toolbar>
        <span className="p-float-label">
          <InputText id="float-input" type="text" value={this.state.newWord}
                     onChange={this.onNewWordChange} onKeyPress={this.onNewWordKeyPress}/>
          <label htmlFor="float-input">New Word</label>
        </span>
        <DataTable value={this.wordsLangService.langWords} selectionMode="single" autoLayout={true}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column field="WORD" header="WORD" />
          <Column field="LEVEL" header="LEVEL" />
          <Column field="NOTE" header="NOTE" />
          <Column style={{width:'40%'}} body={this.actionTemplate} header="ACTIONS" />
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
    this.subscription.add(this.wordsLangService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsLangService.langWords.push(o);
      this.setState({newWord: ''});
      this.updateServiceState();
    }));
  };

  deleteWord(index: number) {
    console.log(index);
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  dictMean(ID: number) {
    const index = this.wordsLangService.langWords.findIndex(value => value.ID === ID);
    history.push('/words-dict/' + index);
  }

  updateServiceState() {
    this.setState({wordsLangService: this.wordsLangService});
  }
};

