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
import { SyntheticEvent, useEffect, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";

export default function PhrasesUnit() {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const subscription = new Subscription();
  const navigate = useNavigate();

  const [selectedRow, setSelectedRow] = useState(null as MUnitPhrase);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [, setPhrasesUnitService] = useState(phrasesUnitService);

  const onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    phrasesUnitService.unitPhrases = e.value;
    phrasesUnitService.reindex(index => updateServiceState());
  };

  const onRefresh = async () => {
    await phrasesUnitService.getDataInTextbook(filter, filterType);
    updateServiceState();
  };

  const onFilterChange = (e: SyntheticEvent) => {
    setFilter((e.nativeEvent.target as HTMLInputElement).value);
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onRefresh();
  };

  const onFilterTypeChange = (e: DropdownChangeEvent) => {
    setFilterType(e.value);
    onRefresh();
  };

  const deletePhrase = (item: MUnitPhrase) => {
    phrasesUnitService.delete(item);
  };

  const onSelectionChange = (e: any) => {
    setSelectedRow(e.data);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  const updateServiceState = () => {
    setPhrasesUnitService(null);
    setPhrasesUnitService(phrasesUnitService);
  };

  useEffect(() => {
    subscription.add(appService.initializeObject.subscribe(_ => {
      onRefresh();
    }));
    return () => {
      subscription.unsubscribe();
    }
  });

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deletePhrase(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => navigate('/phrases-unit-detail/' + rowData.ID)}/>
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(rowData.PHRASE)} />
      <CopyToClipboard text={rowData.PHRASE}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => googlePhrase(rowData.PHRASE)}
              tooltip="Google Phrase" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  const startContent = (
    <>
      <Dropdown id="filterType" options={settingsService.phraseFilterTypes} value={filterType} onChange={onFilterTypeChange} />
      <span className="p-float-label">
        <InputText id="filter" type="text" value={filter}
                   onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="filter">Filter</label>
      </span>
      <Button label="Add" icon="fa fa-plus" onClick={() => navigate('/phrases-unit-detail/0')} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={onRefresh}/>
    </>
  );

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar start={startContent} />
      <DataTable value={phrasesUnitService.unitPhrases} selectionMode="single"
                 onRowReorder={onReorder}
                 selection={selectedRow} onSelectionChange={onSelectionChange}>
        <Column rowReorder={settingsService.selectedTextbook && settingsService.isSingleUnitPart} style={{width: '3em'}} />
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
        <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
        <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
        <Column style={{width:'80px'}} field="PHRASEID" header="PHRASEID" />
        <Column field="PHRASE" header="PHRASE" />
        <Column field="TRANSLATION" header="TRANSLATION" />
        <Column style={{width:'20%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
    </div>
  );
}
