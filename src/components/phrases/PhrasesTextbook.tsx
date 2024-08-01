import * as React from 'react';
import 'reflect-metadata';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
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
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";

export default function PhrasesTextbook() {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const subscription = new Subscription();
  const navigate = useNavigate();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
  const [refreshCount, setRefreshCount] = useState(0);
  const onRefresh = () => setRefreshCount(refreshCount + 1);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setFirst(e.first);
    setRows(e.rows);
    setPage(e.page + 1);
    onRefresh();
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

  const onTextbookFilterChange = (e: DropdownChangeEvent) => {
    setTextbookFilter(e.value);
    onRefresh();
  };

  const deletePhrase = (item: MUnitPhrase) => {
    phrasesUnitService.delete(item);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  useEffect(() => {
    subscription.add(appService.initializeObject.subscribe(_ => {
      setRows(settingsService.USROWSPERPAGE);
      onRefresh();
    }));
    return () => {
      subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    (async () => {
      await phrasesUnitService.getDataInLang(page, rows, filter, filterType, textbookFilter);
      forceUpdate();
    })();
  }, [refreshCount]);

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deletePhrase(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => navigate('/phrases-textbook-detail/' + rowData.ID)}/>
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
      <Dropdown id="textbookFilter" options={settingsService.textbookFilters} value={textbookFilter} onChange={onTextbookFilterChange} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => onRefresh}/>
    </>
  );

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar start={startContent} />
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={phrasesUnitService.textbookPhraseCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      <DataTable value={phrasesUnitService.textbookPhrases} selectionMode="single">
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column style={{width:'150px'}} field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
        <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
        <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
        <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
        <Column style={{width:'80px'}} field="PHRASEID" header="PHRASEID" />
        <Column field="PHRASE" header="PHRASE" />
        <Column field="TRANSLATION" header="TRANSLATION" />
        <Column style={{width:'20%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={phrasesUnitService.textbookPhraseCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
    </div>
  );
}
