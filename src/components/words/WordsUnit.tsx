import * as React from 'react';
import { KeyboardEvent, SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { WordsUnitService } from '../../shared/view-models/wpp/words-unit.service';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import { MUnitWord } from '../../shared/models/wpp/unit-word';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { AppService } from '../../shared/view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import WordsUnitDetail from "./WordsUnitDetail";
import { Checkbox } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";

export default function WordsUnit() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  // https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onNewWordChange = (e: SyntheticEvent) => {
    wordsUnitService.newWord = (e.nativeEvent.target as HTMLInputElement).value;
    onReload();
  };

  const onNewWordKeyPress = async (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !wordsUnitService.newWord) return;
    await wordsUnitService.createWithNewWord();
    onReload();
  };

  const onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    wordsUnitService.unitWords = e.value;
    wordsUnitService.reindex(index => onReload());
  };

  const onFilterChange = (e: SyntheticEvent) => {
    wordsUnitService.filter = (e.nativeEvent.target as HTMLInputElement).value;
    onReload();
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterScopeChange = (e: DropdownChangeEvent) => {
    wordsUnitService.filterScope = e.value;
    onReload();
  };

  const deleteWord = async (item: MUnitWord) => {
    await wordsUnitService.delete(item);
  };

  const getNote = async (item: MUnitWord) => {
    await wordsUnitService.getNote(item);
    onReload();
  };

  const clearNote = async (item: MUnitWord) => {
    await wordsUnitService.clearNote(item);
    onReload();
  };

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  const googleWord = (WORD: string) => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  };

  const dictWord = (item: MUnitWord) => {
    const index = wordsUnitService.unitWords.indexOf(item);
    navigate('/words-dict/unit/' + index);
  };

  const setIfEmpty = (checked: boolean) => {
    wordsUnitService.ifEmpty = checked;
    onReload();
  };

  const getNotes = () => {
    wordsUnitService.getNotes(() => {}, () => {});
  };

  const clearNotes = () => {
    wordsUnitService.clearNotes(() => {}, () => {});
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
      await wordsUnitService.getDataInTextbook();
      forceUpdate();
    })();
  }, [reloadCount]);

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
      <Button icon="fa fa-book" onClick={() => dictWord(rowData)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Get Note" onClick={() => getNote(rowData)}/>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Clear Note" onClick={() => clearNote(rowData)}/>
    </div>;
  };

  const startContent = (
    <>
      <FloatLabel>
        <InputText id="word" value={wordsUnitService.newWord} onChange={onNewWordChange}
                   onKeyPress={onNewWordKeyPress}/>
        <label htmlFor="word">New Word</label>
      </FloatLabel>
      <Button hidden={!settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(wordsUnitService.newWord)}/>
      <Dropdown options={wordsUnitService.scopeFilters} value={wordsUnitService.filterScope}
                onChange={onFilterScopeChange}/>
      <FloatLabel>
        <InputText id="filter" value={wordsUnitService.filter} onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="Filter">Filter</label>
      </FloatLabel>
      <Button label="Add" icon="fa fa-plus" onClick={() => showDetailDialog(0)}/>
      <Button label="Refresh" icon="fa fa-refresh" onClick={onReload}/>
      <div className="flex align-items-center">
        <Checkbox inputId="ifEmpty" checked={wordsUnitService.ifEmpty} onChange={e => setIfEmpty(e.checked)}/>
        <label htmlFor="ifEmpty" className="ml-2">If Empty</label>
        <InputSwitch checked={wordsUnitService.ifEmpty} onChange={(e) => setIfEmpty(e.value)}/>
      </div>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Get Notes"
              onClick={() => getNotes()}/>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Clear Notes"
              onClick={() => clearNotes()}/>
      <Button label="Dictionary" icon="fa fa-book" onClick={() => navigate('/words-dict/unit/0')}/>
    </>
  );

  return (
    <div>
      <Toolbar start={startContent}/>
      <DataTable value={wordsUnitService.unitWords}
                 onRowReorder={onReorder} selectionMode="single">
        <Column rowReorder={settingsService.selectedTextbook && settingsService.isSingleUnitPart}
                style={{width: '3em'}}/>
        <Column style={{width:'80px'}} field="ID" header="ID" />
        <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
        <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
        <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
        <Column style={{width:'80px'}} field="WORDID" header="WORDID" />
        <Column field="WORD" header="WORD" />
        <Column field="NOTE" header="NOTE" />
        <Column style={{width:'80px'}} field="ACCURACY" header="ACCURACY" />
        <Column style={{width:'30%'}} body={actionTemplate} header="ACTIONS" />
      </DataTable>
      {showDetail && <WordsUnitDetail id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
