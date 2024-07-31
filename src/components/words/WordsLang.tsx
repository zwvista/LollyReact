import * as React from 'react';
import { KeyboardEvent, SyntheticEvent, useEffect, useState } from 'react';
import { WordsLangService } from '../../view-models/wpp/words-lang.service';
import 'reflect-metadata';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../../view-models/misc/settings.service';
import { MLangWord } from '../../models/wpp/lang-word';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";

export default function WordsLang() {
  const appService = container.resolve(AppService);
  const wordsLangService = container.resolve(WordsLangService);
  const settingsService = container.resolve(SettingsService);
  const subscription = new Subscription();
  const navigate = useNavigate();

  const [newWord, setNewWord] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null as any);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [, setWordsLangService] = useState(wordsLangService);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setFirst(e.first);
    setRows(e.rows);
    setPage(e.page + 1);
    onRefresh();
  };

  const onNewWordChange = (e: SyntheticEvent) => {
    setNewWord((e.nativeEvent.target as HTMLInputElement).value);
  };

  const onNewWordKeyPress = async (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !newWord) return;
    const o = wordsLangService.newLangWord();
    o.WORD = settingsService.autoCorrectInput(newWord);
    setNewWord('');
    updateServiceState();
    const id = await wordsLangService.create(o);
    o.ID = id as number;
    wordsLangService.langWords.push(o);
  };

  const onRefresh = async () => {
    await wordsLangService.getData(page, rows, filter, filterType);
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

  const onFilterTypeChange = (e: DropdownChangeEvent) => {
    setFilterType(e.value);
    onRefresh();
  };

  const deleteWord = (item: MLangWord) => {
    wordsLangService.delete(item);
  };

  const getNote = async (index: number) => {
    console.log(index);
    await wordsLangService.getNote(index);
  };

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  const googleWord = (WORD: string) => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  };

  const dictWord = (item: MLangWord) => {
    const index = wordsLangService.langWords.indexOf(item);
    navigate('/words-dict/lang/' + index);
  };

  const updateServiceState = () => {
    setWordsLangService(null);
    setWordsLangService(wordsLangService);
  };

  useEffect(() => {
    subscription.add(appService.initializeObject.subscribe(_ => {
      setRows(settingsService.USROWSPERPAGE);
      onRefresh();
    }));
    return () => {
      subscription.unsubscribe();
    };
  });

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deleteWord(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => navigate('/words-lang-detail/' + rowData.ID)} />
      <Button hidden={!settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => dictWord(rowData)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Note" onClick={() => getNote(rowData.ID)} />
    </div>;
  };

  const leftContents = (
    <>
      <span className="p-float-label">
        <InputText id="word" type="text" value={newWord}
                   onChange={onNewWordChange} onKeyPress={onNewWordKeyPress}/>
        <label htmlFor="word">New Word</label>
      </span>
      <Dropdown id="filterType" options={settingsService.wordFilterTypes} value={filterType} onChange={onFilterTypeChange} />
      <span className="p-float-label">
        <InputText id="filter" type="text" value={filter}
                   onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="Filter">Filter</label>
      </span>
      <Button hidden={!settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(newWord)} />
      <Button label="Add" icon="fa fa-plus" onClick={() => navigate('/words-unit-detail/0')} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={onRefresh}/>
      <Button hidden={!settingsService.selectedDictNote} className="p-button-warning" label="Retrieve All Notes" />
      <Button hidden={!settingsService.selectedDictNote} className="p-button-warning" label="Retrieve Notes If Empty" />
      <Button label="Dictionary" icon="fa fa-book" onClick={() => navigate('/words-dict/unit/0')} />
    </>
  );

  return !appService.isInitialized && wordsLangService ? (<div/>) : (
    <div>
      <Toolbar left={leftContents} />
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={wordsLangService.langWordsCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      <DataTable value={wordsLangService.langWords} selectionMode="single"
                 selection={selectedRow} onSelectionChange={onSelectionChange}>
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column field="WORD" header="WORD" />
        <Column field="NOTE" header="NOTE" />
        <Column style={{width:'80px'}} field="ACCURACY" header="ACCURACY" />
        <Column style={{width:'30%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={wordsLangService.langWordsCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
    </div>
  );
}

