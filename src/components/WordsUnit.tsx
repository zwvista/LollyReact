import * as React from 'react';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../view-models/settings.service';

export default class WordsUnit extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
    hasNoNote: this.settingsService.dictsNote.length === 0,
  };

  componentDidMount() {
    this.subscription.add(this.wordsUnitService.getData().subscribe(
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
              onClick={() => history.push('/words-unit-detail/' + rowData.ID)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button hidden={this.state.hasNoNote} label="Retrieve Note"/>
      <Button label="Google Word" onClick={() => this.googleWord(rowData.WORD)} />
      <Button label="Dictionary" onClick={() => this.dictMean(rowData.ID)} />
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/words-unit-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" />
            <Button hidden={this.state.hasNoNote} label="Retrieve All Notes" />
            <Button hidden={this.state.hasNoNote} label="Retrieve Notes If Empty" />
            <Button label="Dictionary" onClick={() => history.push('/words-dict/unit/0')} />
          </div>
        </Toolbar>
        <span className="p-float-label">
          <InputText id="float-input" type="text" value={this.state.newWord}
                     onChange={this.onNewWordChange} onKeyPress={this.onNewWordKeyPress}/>
          <label htmlFor="float-input">New Word</label>
        </span>
        <DataTable value={this.wordsUnitService.unitWords} selectionMode="single" autoLayout={true}
                   onRowReorder={this.onReorder}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNIT" header="UNIT" />
          <Column style={{width:'80px'}} field="PART" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column field="WORD" header="WORD" />
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
    const o = this.wordsUnitService.newUnitWord();
    o.WORD = this.settingsService.autoCorrectInput(this.state.newWord);
    this.setState({newWord: ''});
    this.updateServiceState();
    this.subscription.add(this.wordsUnitService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsUnitService.unitWords.push(o);
    }));
  };

  onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    this.wordsUnitService.unitWords = e.value;
    this.wordsUnitService.reindex(index => this.updateServiceState());
  };

  deleteWord(index: number) {
    console.log(index);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsUnitService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  dictMean(ID: number) {
    const index = this.wordsUnitService.unitWords.findIndex(value => value.ID === ID);
    history.push('/words-dict/unit/' + index);
  }

  getNotes(ifEmpty: boolean) {
    this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
  }

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

