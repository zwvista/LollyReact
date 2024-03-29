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
import { googleString } from '../../common/common';
import { SettingsService } from '../../view-models/misc/settings.service';
import { MUnitPhrase } from '../../models/wpp/unit-phrase';
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';

export default class PhrasesTextbook extends React.Component<any, any> {
  @resolve appService: AppService;
  @resolve phrasesUnitService: PhrasesUnitService;
  @resolve settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: 0,
    page: 1,
    selectedRow: null as MUnitPhrase,
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
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => this.deletePhrase(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => this.props.history.push('/phrases-textbook-detail/' + rowData.ID)}/>
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.PHRASE)} />
      <CopyToClipboard text={rowData.PHRASE}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => this.googlePhrase(rowData.PHRASE)}
              tooltip="Google Phrase" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  render() {
    const leftContents = (
      <React.Fragment>
        <Dropdown id="filterType" options={this.settingsService.phraseFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
        <span className="p-float-label">
            <InputText id="filter" type="text" value={this.state.filter}
                       onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
            <label htmlFor="filter">Filter</label>
          </span>
        <Dropdown id="textbookFilter" options={this.settingsService.textbookFilters} value={this.state.textbookFilter} onChange={this.onTextbookFilterChange} />
        <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh}/>
      </React.Fragment>
    );
    return !this.appService.isInitialized ? (<div/>) : (
      <div>
        <Toolbar left={leftContents} />
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesUnitService.textbookPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.phrasesUnitService.textbookPhrases} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'150px'}} field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="PHRASEID" header="PHRASEID" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesUnitService.textbookPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
      </div>
    );
  }

  onRefresh = async () => {
    await this.phrasesUnitService.getDataInLang(this.state.page, this.state.rows, this.state.filter, this.state.filterType, this.state.textbookFilter);
    this.updateServiceState();
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

  deletePhrase(item: MUnitPhrase) {
    this.phrasesUnitService.delete(item);
  }

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

  updateServiceState() {
    this.setState({phrasesUnitService: this.phrasesUnitService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

