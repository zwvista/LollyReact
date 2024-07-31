import * as React from 'react';
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
import 'reflect-metadata';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { googleString } from '../../common/common';
import { SettingsService } from '../../view-models/misc/settings.service';
import { MUnitPhrase } from '../../models/wpp/unit-phrase';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';

export default class PhrasesUnit extends React.Component<any, any> {
  appService = container.resolve(AppService);
  phrasesUnitService = container.resolve(PhrasesUnitService);
  settingsService = container.resolve(SettingsService);
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
              onClick={() => this.props.history.push('/phrases-unit-detail/' + rowData.ID)}/>
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
        <Button label="Add" icon="fa fa-plus" onClick={() => this.props.history.push('/phrases-unit-detail/0')} />
        <Button label="Refresh" icon="fa fa-refresh" onClick={this.onRefresh}/>
      </React.Fragment>
    );
    return (
      <div>
        <Toolbar left={leftContents} />
        <DataTable value={this.phrasesUnitService.unitPhrases} selectionMode="single"
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

  onRefresh = async () => {
    await this.phrasesUnitService.getDataInTextbook(this.state.filter, this.state.filterType);
    this.updateServiceState();
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    this.onRefresh();
  };

  onFilterTypeChange = (e: DropdownChangeEvent) => {
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

