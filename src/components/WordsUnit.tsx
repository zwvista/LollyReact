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
import * as $ from "jquery";
import { MWordColor } from '../models/word-color';

export default class WordsUnit extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
    selectedRow: null as any,
  };

  componentDidMount() {
    this.onRefresh(null);
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
      <Button hidden={!this.settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-arrow-up" tooltipOptions={{position: 'top'}} className="p-button-warning"
              tooltip="Level Up" onClick={() => this.updateLevel(rowData.ID, 1)} />
      <Button icon="fa fa-arrow-down" tooltipOptions={{position: 'top'}} className="p-button-warning"
              tooltip="Level Down" onClick={() => this.updateLevel(rowData.ID, -1)} />
      <Button icon="fa fa-google" onClick={() => this.googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => this.dictMean(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Note" onClick={() => this.getNote(rowData.ID)}/>
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
            <Button hidden={!this.settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(this.state.newWord)} />
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/words-unit-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={this.onRefresh}/>
            <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve All Notes" />
            <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Notes If Empty" />
            <Button label="Dictionary" icon="fa fa-book" onClick={() => history.push('/words-dict/unit/0')} />
          </span>
          </div>
        </Toolbar>
        <DataTable value={this.wordsUnitService.unitWords} autoLayout={true}
                   onRowReorder={this.onReorder} selectionMode="single"
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="WORDID" header="WORDID" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column style={{width:'80px'}} field="LEVEL" header="LEVEL" />
          <Column style={{width:'30%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

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
      this.updateServiceState();
    }));
  };

  onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    this.wordsUnitService.unitWords = e.value;
    this.wordsUnitService.reindex(index => this.updateServiceState());
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

  onRefresh = (e:any) => {
    this.subscription.add(this.wordsUnitService.getData().subscribe(_ => {
      this.updateServiceState();
      const self = this;
      $("tr").each((i, row) => {
        if (i === 0) return;
        this.setRowStyle(self.wordsUnitService.unitWords[i - 1], $(row));
      });
    }));
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

  updateLevel(ID: number, delta: number) {
    const i = this.wordsUnitService.unitWords.findIndex(v => v.ID === ID);
    const o = this.wordsUnitService.unitWords[i];
    this.settingsService.updateLevel(o, o.WORDID, delta).subscribe(_ => this.setRowStyle(o, $('tr').eq(i + 1)));
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

