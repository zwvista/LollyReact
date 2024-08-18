import * as React from 'react';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Toolbar } from 'primereact/toolbar';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../../view-models/misc/settings.service';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import { MUnitWord } from '../../models/wpp/unit-word';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import WordsTextbookDetail from "./WordsTextbookDetail";

export default function WordsTextbook() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
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

  const deleteWord = async (item: MUnitWord) => {
    await wordsUnitService.delete(item);
  };

  const getNote = async (item: MUnitWord) => {
    await wordsUnitService.getNote(item);
  };

  const clearNote = async (item: MUnitWord) => {
    await wordsUnitService.clearNote(item);
  };

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  const googleWord = (WORD: string) => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  };

  const dictWord = (item: MUnitWord) => {
    const index = wordsUnitService.textbookWords.indexOf(item);
    navigate('/words-dict/textbook/' + index);
  };

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  useEffect(() => {
    (async () => {
      await appService.getData();
      setRows(settingsService.USROWSPERPAGE);
      onRefresh();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await wordsUnitService.getDataInLang(page, rows, filter, filterType, textbookFilter);
      forceUpdate();
    })();
  }, [refreshCount]);

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button severity="danger" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deleteWord(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => showDetailDialog(rowData.ID)} />
      <Button hidden={!settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => dictWord(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Get Note" onClick={() => getNote(rowData.ID)} />
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Clear Note" onClick={() => clearNote(rowData.ID)} />
    </div>;
  };

  const startContent = (
    <>
      <Dropdown options={settingsService.wordFilterTypes} value={filterType} onChange={onFilterTypeChange} />
      <FloatLabel>
        <InputText id="filter" value={filter} onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="filter">Filter</label>
      </FloatLabel>
      <Dropdown options={settingsService.textbookFilters} value={textbookFilter} onChange={onTextbookFilterChange} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => onRefresh}/>
      <Button label="Dictionary" icon="fa fa-book" onClick={() => navigate('/words-dict/textbook/0')} />
    </>
  );

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar start={startContent} />
      <Paginator first={first} rows={rows} onPageChange={onPageChange}
                 totalRecords={wordsUnitService.textbookWordCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      <DataTable value={wordsUnitService.textbookWords} selectionMode="single">
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
      {showDetail && <WordsTextbookDetail id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}

