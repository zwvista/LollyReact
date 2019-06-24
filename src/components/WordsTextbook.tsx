import * as React from 'react';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { PageState, Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../view-models/settings.service';
import * as $ from "jquery";
import { MWordColor } from '../models/word-color';
import { WordsUnitService } from '../view-models/words-unit.service';
import { MUnitWord } from '../models/unit-word';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';

export default class WordsTextbook extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: this.settingsService.USROWSPERPAGE,
    page: 1,
    selectedRow: null as any,
    filter: '',
    filterType: 0,
    textbookFilter: 0,
  };

  componentDidMount() {
    this.onRefresh();
  }

  onPageChange = (e: PageState) => {
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
              onClick={() => history.push('/words-textbook-detail/' + rowData.ID)} />
      <Button hidden={!this.settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-arrow-up" tooltipOptions={{position: 'top'}} className="p-button-warning"
              tooltip="Level Up" onClick={() => this.updateLevel(rowData, 1)} />
      <Button icon="fa fa-arrow-down" tooltipOptions={{position: 'top'}} className="p-button-warning"
              tooltip="Level Down" onClick={() => this.updateLevel(rowData, -1)} />
      <Button icon="fa fa-google" onClick={() => this.googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => this.dictReference(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!this.settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Note" onClick={() => this.getNote(rowData.ID)} />
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Dropdown id="filterType" options={this.settingsService.wordFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
            <span className="p-float-label">
              <InputText id="float-input" type="text" value={this.state.filter}
                         onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
              <label htmlFor="float-input">New Word</label>
            </span>
            <Dropdown id="textbookFilter" options={this.settingsService.textbookFilters} value={this.state.textbookFilter} onChange={this.onTextbookFilterChange} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh}/>
            <Button label="Dictionary" icon="fa fa-book" onClick={() => history.push('/words-dict/textbook/0')} />
          </div>
        </Toolbar>
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
          <Column style={{width:'80px'}} field="LEVEL" header="LEVEL" />
          <Column style={{width:'80px'}} field="ACCURACY" header="ACCURACY" />
          <Column style={{width:'30%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.wordsUnitService.textbookWordCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
      </div>
    );
  }

  // Here we have to use JQuery to set td styles based on row number,
  // as PrimeReact DataTable has no rowStyle attribute.
  setRowStyle(o: MWordColor, tr: any) {
    const c = o.colorStyle;
    if (c['background-color'])
      $(tr).css('background-color', c['background-color']).css('color', c['color']);
    else
      $(tr).css('background-color', '').css('color', '');
  }

  onRefresh = () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    this.subscription.add(this.wordsUnitService.getDataInLang(this.state.page, this.state.rows, this.state.filter, this.state.filterType, this.state.textbookFilter).subscribe(_ => {
      this.updateServiceState();
      if (this.wordsUnitService.textbookWords.length === 0) return;
      $("tr").each((i, tr) => {
        if (i === 0) return;
        this.setRowStyle(this.wordsUnitService.textbookWords[i - 1], tr);
      });
    }));
  };

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (this.state.filter && this.state.filterType === 0)
      this.setState({filterType: this.state.filterType = 1});
    else if (!this.state.filter && this.state.filterType !== 0)
      this.setState({filterType: this.state.filterType = 0});
    this.onRefresh();
  };

  onFilterTypeChange = (e: {originalEvent: Event, value: any}) => {
    this.setState({filterType: this.state.filterType = e.value});
    this.onRefresh();
  };

  onTextbookFilterChange = (e: {originalEvent: Event, value: any}) => {
    this.setState({textbookFilter: this.state.textbookFilter = e.value});
    this.onRefresh();
  };

  deleteWord(item: MUnitWord) {
    this.wordsUnitService.delete(item);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsUnitService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  updateLevel(item: MUnitWord, delta: number) {
    const i = this.wordsUnitService.textbookWords.indexOf(item);
    this.settingsService.updateLevel(item, item.WORDID, delta).subscribe(
      _ => this.setRowStyle(item, $('tr').eq(i + 1)));
  }

  dictReference(item: MUnitWord) {
    const index = this.wordsUnitService.textbookWords.indexOf(item);
    history.push('/words-dict/textbook/' + index);
  }

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

