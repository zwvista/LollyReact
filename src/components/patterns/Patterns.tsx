import * as React from 'react';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { PageState, Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import history from '../../view-models/misc/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { googleString } from '../../common/common';
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { PatternsService } from '../../view-models/wpp/patterns.service';
import { MPattern } from '../../models/wpp/pattern';

export default class Patterns extends React.Component<any, any> {
  @Inject appService: AppService;
  @Inject patternsService: PatternsService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: 0,
    page: 1,
    selectedRow: null as MPattern,
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
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => this.deletePattern(rowData.ID)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/patterns-detail/' + rowData.ID)}/>
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.PATTERN)} />
      <CopyToClipboard text={rowData.PATTERN}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => this.googlePattern(rowData.PATTERN)}
              tooltip="Google Pattern" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  render() {
    return !this.appService.isInitialized ? (<div/>) : (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Dropdown id="filterType" options={this.settingsService.patternFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
            <span className="p-float-label">
              <InputText id="filter" type="text" value={this.state.filter}
                         onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
              <label htmlFor="filter">Filter</label>
            </span>
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/patterns-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh}/>
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.patternsService.patternCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.patternsService.patterns} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column field="PATTERN" header="PATTERN" />
          <Column field="NOTE" header="NOTE" />
          <Column field="TAGS" header="TAGS" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.patternsService.patternCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
      </div>
    );
  }

  onRefresh = () => {
    this.subscription.add(this.patternsService.getData(this.state.page, this.state.rows, this.state.filter, this.state.filterType).subscribe(
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
    this.onRefresh();
  };

  onFilterTypeChange = (e: {originalEvent: Event, value: any}) => {
    this.setState({filterType: this.state.filterType = e.value});
    this.onRefresh();
  };

  deletePattern(id: number) {
    this.patternsService.delete(id);
  }

  updateServiceState() {
    this.setState({patternsService: this.patternsService});
  }

  googlePattern(pattern: string) {
    googleString(pattern);
  }
};

