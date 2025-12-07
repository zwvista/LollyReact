import * as React from 'react';
import { PhrasesUnitService } from '../../shared/view-models/wpp/phrases-unit.service';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Toolbar } from 'primereact/toolbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { googleString } from '../../shared/common/common';
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import { MUnitPhrase } from '../../shared/models/wpp/unit-phrase';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import PhrasesUnitDetail from "./PhrasesUnitDetail";

export default function PhrasesUnit() {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    phrasesUnitService.unitPhrases = e.value;
    phrasesUnitService.reindex(index => onReload());
  };

  const onFilterChange = (e: SyntheticEvent) => {
    phrasesUnitService.filter = (e.nativeEvent.target as HTMLInputElement).value;
    onReload();
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterScopeChange = (e: DropdownChangeEvent) => {
    phrasesUnitService.filterScope = e.value;
    onReload();
  };

  const deletePhrase = async (item: MUnitPhrase) => {
    await phrasesUnitService.delete(item);
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
      await phrasesUnitService.getDataInTextbook();
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
      <Dropdown options={phrasesUnitService.scopeFilters} value={phrasesUnitService.filterScope} onChange={onFilterScopeChange} />
      <FloatLabel>
        <InputText id="filter" value={phrasesUnitService.filter} onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="filter">Filter</label>
      </FloatLabel>
      <Button label="Add" icon="fa fa-plus" onClick={() => showDetailDialog(0)} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={onReload}/>
    </>
  );

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar start={startContent} />
      <DataTable value={phrasesUnitService.unitPhrases} selectionMode="single"
                 onRowReorder={onReorder}>
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
      {showDetail && <PhrasesUnitDetail id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
