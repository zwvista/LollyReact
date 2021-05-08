import * as React from 'react';
import { KeyboardEvent, SyntheticEvent } from 'react';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import history from '../../view-models/misc/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../../view-models/misc/settings.service';
import * as $ from "jquery";
import { MUnitWord } from '../../models/wpp/unit-word';
import { Dropdown } from 'primereact/dropdown';
import { AppService } from '../../view-models/misc/app.service';

export default class WordsUnit extends React.Component<any, any> {
  @Inject appService: AppService;
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
    selectedRow: null as any,
    filter: '',
    filterType: 0,
  };

  componentDidMount() {
    this.subscription.add(this.appService.initializeObject.subscribe(_ => {
      this.onRefresh();
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => this.deleteWord(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/words-unit-detail/' + rowData.ID)} />
      <Button hidden={!this.settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => this.googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => this.dictWord(rowData)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Note" onClick={() => this.getNote(rowData)}/>
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <span className="p-float-label">
              <InputText id="word" type="text" value={this.state.newWord}
                         onChange={this.onNewWordChange} onKeyPress={this.onNewWordKeyPress}/>
              <label htmlFor="word">New Word</label>
            </span>
            <Dropdown id="filterType" options={this.settingsService.wordFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
            <span className="p-float-label">
              <InputText id="filter" type="text" value={this.state.filter}
                         onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
              <label htmlFor="Filter">Filter</label>
            </span>
            <Button hidden={!this.settingsService.selectedVoice} icon="fa fa-volumeooltipOptions={{position: 'top'}}"
                    tooltip="Speak" onClick={() => this.settingsService.speak(this.state.newWord)} />
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/words-unit-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={this.onRefresh}/>
            <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve All Notes" />
            <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Notes If Empty" />
            <Button label="Dictionary" icon="fa fa-book" onClick={() => history.push('/words-dict/unit/0')} />
          </div>
        </Toolbar>
        <DataTable value={this.wordsUnitService.unitWords} autoLayout={true}
                   onRowReorder={this.onReorder} selectionMode="single"
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column rowReorder={this.settingsService.selectedTextbook && this.settingsService.isSingleUnitPart} style={{width: '3em'}} />
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="WORDID" header="WORDID" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column style={{width:'80px'}} field="ACCURACY" header="ACCURACY" />
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

  onRefresh = () => {
    this.subscription.add(this.wordsUnitService.getDataInTextbook(this.state.filter, this.state.filterType).subscribe(_ => {
      this.updateServiceState();
    }));
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    this.onRefresh();
  };

  onFilterTypeChange = (e: {originalEvent: Event, value: any}) => {
    this.setState({filterType: this.state.filterType = e.value});
    this.onRefresh();
  };

  deleteWord(item: MUnitWord) {
    this.wordsUnitService.delete(item);
  }

  getNote(item: MUnitWord) {
    const index = this.wordsUnitService.unitWords.indexOf(item);
    this.wordsUnitService.getNote(index).subscribe(_ => this.updateServiceState());
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  dictWord(item: MUnitWord) {
    const index = this.wordsUnitService.unitWords.indexOf(item);
    history.push('/words-dict/unit/' + index);
  }

  getNotes(ifEmpty: boolean) {
    this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
  }

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

