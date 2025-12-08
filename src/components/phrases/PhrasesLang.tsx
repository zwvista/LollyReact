import * as React from 'react';
import { PhrasesLangService } from '../../shared/view-models/wpp/phrases-lang.service';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Toolbar } from 'primereact/toolbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { googleString } from '../../shared/common/common';
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import { MLangPhrase } from '../../shared/models/wpp/lang-phrase';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import PhrasesLangDetail from "./PhrasesLangDetail";

export default function PhrasesLang() {
  const appService = container.resolve(AppService);
  const phrasesLangService = container.resolve(PhrasesLangService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [first, setFirst] = useState(0);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setFirst(e.first);
    phrasesLangService.rows = e.rows;
    phrasesLangService.page = e.page + 1;
    onReload();
  };

  const onFilterChange = (e: SyntheticEvent) => {
    phrasesLangService.filter = (e.nativeEvent.target as HTMLInputElement).value;
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterTypeChange = (e: DropdownChangeEvent) => {
    phrasesLangService.filterType = e.value;
    onReload();
  };

  const deletePhrase = async (item: MLangPhrase) => {
    await phrasesLangService.delete(item);
  };

  const googlePhrase = (phrase: string) => {
    googleString(phrase);
  };

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  useEffect(() => {
    (async () => {
      await appService.getData();
      onReload();
    })();
  }, []);

  useEffect(() => {
    if (!appService.isInitialized) return;
    (async () => {
      await phrasesLangService.getData();
      forceUpdate();
    })();
  }, [reloadCount]);

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button severity="danger" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deletePhrase(rowData)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => showDetailDialog(rowData.ID)}/>
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
      <Dropdown options={settingsService.phraseFilterTypes} value={phrasesLangService.filterType} onChange={onFilterTypeChange} />
      <FloatLabel>
        <InputText id="filter" value={phrasesLangService.filter} onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="filter">Filter</label>
      </FloatLabel>
      <Button label="Add" icon="fa fa-plus" onClick={() => showDetailDialog(0)} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => onReload()}/>
    </>
  );

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar start={startContent} />
      <Paginator first={first} rows={phrasesLangService.rows} onPageChange={onPageChange}
                 totalRecords={phrasesLangService.langPhraseCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      <DataTable value={phrasesLangService.langPhrases} selectionMode="single">
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column field="PHRASE" header="PHRASE" />
        <Column field="TRANSLATION" header="TRANSLATION" />
        <Column style={{width:'20%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
      <Paginator first={first} rows={phrasesLangService.rows} onPageChange={onPageChange}
                 totalRecords={phrasesLangService.langPhraseCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      {showDetail && <PhrasesLangDetail id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
