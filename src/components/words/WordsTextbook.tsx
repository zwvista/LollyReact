import * as React from 'react';
import 'reflect-metadata';
import { resolve } from "inversify-react";
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageState } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../../view-models/misc/settings.service';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import { MUnitWord } from '../../models/wpp/unit-word';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';

export default class WordsTextbook extends React.Component<any, any> {
  @resolve appService: AppService;
  @resolve wordsUnitService: WordsUnitService;
  @resolve settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: 0,
    page: 1,
    selectedRow: null as any,
    filter: '',
    filterType: 0,
    textbookFilter: 0,
  };

  componentDidMount() {
    this.subscription.add(this.appService.initializeObject.subscribe(_ => {
      this.setState({rows: this.state.rows = this.settingsService.USROWSPERPAGE});
      this.onRefresh();
    }));
  }

  onPageChange = (e: PaginatorPageState) => {
    this.setState({
      first: e.first,
      rows: this.state.rows = e.rows,
      page: this.state.page = e.page + 1,
    });
    this.onRefresh();
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => this.deleteWord(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => this.props.history.push('/words-textbook-detail/' + rowData.ID)} />
      <Button hidden={!this.settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => this.googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => this.dictWord(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Note" onClick={() => this.getNote(rowData.ID)} />
    </div>;
  };

  render() {
    const leftContents = (
      <React.Fragment>
        <Dropdown id="filterType" options={this.settingsService.wordFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
        <span className="p-float-label">
            <InputText id="filter" type="text" value={this.state.filter}
                       onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
            <label htmlFor="filter">Filter</label>
          </span>
        <Dropdown id="textbookFilter" options={this.settingsService.textbookFilters} value={this.state.textbookFilter} onChange={this.onTextbookFilterChange} />
        <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh}/>
        <Button label="Dictionary" icon="fa fa-book" onClick={() => this.props.history.push('/words-dict/textbook/0')} />
      </React.Fragment>
    );
    return !this.appService.isInitialized ? (<div/>) : (
      <div>
        <Toolbar left={leftContents} />
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.wordsUnitService.textbookWordCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.wordsUnitService.textbookWords} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'150px'}} field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="WORDID" header="WORDID" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column style={{width:'80px'}} field="ACCURACY" header="ACCURACY" />
          <Column style={{width:'30%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.wordsUnitService.textbookWordCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
      </div>
    );
  }

  onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await this.wordsUnitService.getDataInLang(this.state.page, this.state.rows, this.state.filter, this.state.filterType, this.state.textbookFilter);
    this.updateServiceState();
  };

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    this.onRefresh();
  };

  onFilterTypeChange = (e: {originalEvent: SyntheticEvent, value: any}) => {
    this.setState({filterType: this.state.filterType = e.value});
    this.onRefresh();
  };

  onTextbookFilterChange = (e: {originalEvent: SyntheticEvent, value: any}) => {
    this.setState({textbookFilter: this.state.textbookFilter = e.value});
    this.onRefresh();
  };

  deleteWord(item: MUnitWord) {
    this.wordsUnitService.delete(item);
  }

  async getNote(index: number) {
    console.log(index);
    await this.wordsUnitService.getNote(index);
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  dictWord(item: MUnitWord) {
    const index = this.wordsUnitService.textbookWords.indexOf(item);
    this.props.history.push('/words-dict/textbook/' + index);
  }

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

