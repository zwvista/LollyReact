import * as React from 'react';
import 'reflect-metadata';
import { container } from "tsyringe";
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
import { SyntheticEvent, useEffect, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";

export default function WordsTextbook() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const subscription = new Subscription();
  const navigate = useNavigate();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
  const [, setWordsUnitService] = useState(wordsUnitService);

  const onPageChange = (e: PaginatorPageState) => {
    setFirst(e.first);
    setRows(e.rows);
    setPage(e.page + 1);
    onRefresh();
  };

  const onRefresh = async () => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    await wordsUnitService.getDataInLang(page, rows, filter, filterType, textbookFilter);
    updateServiceState();
  };

  const onSelectionChange = (e: any) => {
    setSelectedRow(e.data);
  };

  const onFilterChange = (e: SyntheticEvent) => {
    setFilter((e.nativeEvent.target as HTMLInputElement).value);
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onRefresh();
  };

  const onFilterTypeChange = (e: {originalEvent: SyntheticEvent, value: any}) => {
    setFilterType(e.value);
    onRefresh();
  };

  const onTextbookFilterChange = (e: {originalEvent: SyntheticEvent, value: any}) => {
    setTextbookFilter(e.value);
    onRefresh();
  };

  const deleteWord = (item: MUnitWord) => {
    wordsUnitService.delete(item);
  };

  const getNote = async (index: number) => {
    console.log(index);
    await wordsUnitService.getNote(index);
  };

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  const googleWord = (WORD: string) => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  const dictWord = (item: MUnitWord) => {
    const index = wordsUnitService.textbookWords.indexOf(item);
    navigate('/words-dict/textbook/' + index);
  }

  const updateServiceState = () => {
    setWordsUnitService(null);
    setWordsUnitService(wordsUnitService);
  };

  useEffect(() => {
    subscription.add(appService.initializeObject.subscribe(_ => {
      setRows(settingsService.USROWSPERPAGE);
      onRefresh();
    }));
    return () => {
      subscription.unsubscribe();
    }
  });

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deleteWord(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => navigate('/words-textbook-detail/' + rowData.ID)} />
      <Button hidden={!settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => dictWord(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Note" onClick={() => getNote(rowData.ID)} />
    </div>;
  };

  const leftContents = (
    <>
      <Dropdown id="filterType" options={settingsService.wordFilterTypes} value={filterType} onChange={onFilterTypeChange} />
      <span className="p-float-label">
          <InputText id="filter" type="text" value={filter}
                     onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
          <label htmlFor="filter">Filter</label>
        </span>
      <Dropdown id="textbookFilter" options={settingsService.textbookFilters} value={textbookFilter} onChange={onTextbookFilterChange} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => onRefresh}/>
      <Button label="Dictionary" icon="fa fa-book" onClick={() => navigate('/words-dict/textbook/0')} />
    </>
  );

  return !appService.isInitialized && wordsUnitService ? (<div/>) : (
    <div>
      <Toolbar left={leftContents} />
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={wordsUnitService.textbookWordCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      <DataTable value={wordsUnitService.textbookWords} selectionMode="single" autoLayout={true}
                 selection={selectedRow} onSelectionChange={onSelectionChange}>
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column style={{width:'150px'}} field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
        <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
        <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
        <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
        <Column style={{width:'80px'}} field="WORDID" header="WORDID" />
        <Column field="WORD" header="WORD" />
        <Column field="NOTE" header="NOTE" />
        <Column style={{width:'80px'}} field="ACCURACY" header="ACCURACY" />
        <Column style={{width:'30%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={wordsUnitService.textbookWordCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
    </div>
  );
}

