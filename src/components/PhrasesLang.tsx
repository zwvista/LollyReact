import * as React from 'react';
import { PhrasesLangService } from '../view-models/phrases-lang.service';
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
import { googleString } from '../common/common';
import { SettingsService } from '../view-models/settings.service';
import { MLangPhrase } from '../models/lang-phrase';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../view-models/app.service';

export default class PhrasesLang extends React.Component<any, any> {
  @Inject appService: AppService;
  @Inject phrasesLangService: PhrasesLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: 0,
    page: 1,
    selectedRow: null as MLangPhrase,
    filter: '',
    filterType: 0,
  };

  componentDidMount() {
    this.subscription.add(this.appService.initializeObject.subscribe(_ => {
      this.setState({rows: this.state.rows = this.settingsService.USROWSPERPAGE});
      this.onRefresh();
    }));
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
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => this.deletePhrase(rowData.ID)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/phrases-lang-detail/' + rowData.ID)}/>
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
    return !this.appService.isInitialized ? (<div/>) : (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Dropdown id="filterType" options={this.settingsService.phraseFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
            <span className="p-float-label">
              <InputText id="float-input" type="text" value={this.state.filter}
                         onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
              <label htmlFor="float-input">Filter</label>
            </span>
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/phrases-lang-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh}/>
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesLangService.langPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.phrasesLangService.langPhrases} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesLangService.langPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
      </div>
    );
  }

  onRefresh = () => {
    this.subscription.add(this.phrasesLangService.getData(this.state.page, this.state.rows, this.state.filter, this.state.filterType).subscribe(
      _ => this.updateServiceState()
    ));
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

  deletePhrase(id: number) {
    this.phrasesLangService.delete(id);
  }

  updateServiceState() {
    this.setState({phrasesLangService: this.phrasesLangService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

