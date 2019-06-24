import * as React from 'react';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { googleString } from '../common/common';
import { SettingsService } from '../view-models/settings.service';
import { MUnitPhrase } from '../models/unit-phrase';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../view-models/app.service';

export default class PhrasesUnit extends React.Component<any, any> {
  @Inject appService: AppService;
  @Inject phrasesUnitService: PhrasesUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    selectedRow: null as MUnitPhrase,
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
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => this.deletePhrase(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/phrases-unit-detail/' + rowData.ID)}/>
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
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Dropdown id="filterType" options={this.settingsService.phraseFilterTypes} value={this.state.filterType} onChange={this.onFilterTypeChange} />
            <span className="p-float-label">
              <InputText id="float-input" type="text" value={this.state.filter}
                         onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
              <label htmlFor="float-input">Filter</label>
            </span>
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/phrases-unit-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={this.onRefresh}/>
          </div>
        </Toolbar>
        <DataTable value={this.phrasesUnitService.unitPhrases} selectionMode="single" autoLayout={true}
                   onRowReorder={this.onReorder}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column rowReorder={this.settingsService.selectedTextbook && this.settingsService.isSingleUnitPart} style={{width: '3em'}} />
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="PHRASEID" header="PHRASEID" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    this.phrasesUnitService.unitPhrases = e.value;
    this.phrasesUnitService.reindex(index => this.updateServiceState());
  };

  onRefresh = () => {
    this.subscription.add(this.phrasesUnitService.getDataInTextbook(this.state.filter, this.state.filterType).subscribe(
      _ => this.updateServiceState()
    ));
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

