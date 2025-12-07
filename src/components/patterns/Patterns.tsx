import * as React from 'react';
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
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { PatternsService } from '../../shared/view-models/wpp/patterns.service';
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import PatternsDetail from "./PatternsDetail";

export default function Patterns() {
  const appService = container.resolve(AppService);
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [first, setFirst] = useState(0);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    setFirst(e.first);
    patternsService.rows = e.rows;
    patternsService.page = e.page + 1;
    onReload();
  };

  const onFilterChange = (e: SyntheticEvent) => {
    patternsService.filter = (e.nativeEvent.target as HTMLInputElement).value;
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterScopeChange = (e: DropdownChangeEvent) => {
    patternsService.filterScope = e.value;
    onReload();
  };

  const deletePattern = async (id: number) => {
    await patternsService.delete(id);
  };

  const googlePattern = (pattern: string) => {
    googleString(pattern);
  };

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDetail(true);
  };

  useEffect(() => {
    (async () => {
      await appService.getData();
      patternsService.rows = settingsService.USROWSPERPAGE;
      onReload();
    })();
  }, []);

  useEffect(() => {
    if (!appService.isInitialized) return;
    (async () => {
      await patternsService.getData();
      forceUpdate();
    })();
  }, [reloadCount]);

  const actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button severity="danger" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} onClick={() => deletePattern(rowData.ID)} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => showDetailDialog(rowData.ID)}/>
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(rowData.PATTERN)} />
      <CopyToClipboard text={rowData.PATTERN}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => googlePattern(rowData.PATTERN)}
              tooltip="Google Pattern" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  const startContent = (
    <>
      <Dropdown options={patternsService.scopeFilters} value={patternsService.filterScope} onChange={onFilterScopeChange} />
      <FloatLabel>
        <InputText id="filter" value={patternsService.filter} onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="filter">Filter</label>
      </FloatLabel>
      <Button label="Add" icon="fa fa-plus" onClick={() => showDetailDialog(0)} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => onReload()}/>
    </>
  );

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar start={startContent} />
      <Paginator first={first} rows={patternsService.rows} onPageChange={onPageChange}
                 totalRecords={patternsService.patternCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      <DataTable value={patternsService.patterns} selectionMode="single">
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column field="PATTERN" header="PATTERN" />
        <Column field="TAGS" header="TAGS" />
        <Column field="TITLE" header="TITLE" />
        <Column field="URL" header="URL" />
        <Column style={{width:'20%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
      <Paginator first={first} rows={patternsService.rows} onPageChange={onPageChange}
                 totalRecords={patternsService.patternCount}
                 rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}/>
      {showDetail && <PatternsDetail id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
