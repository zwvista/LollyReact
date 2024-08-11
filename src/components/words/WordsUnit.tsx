import * as React from 'react';
import { KeyboardEvent, SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import 'reflect-metadata';
import { container } from "tsyringe";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../../view-models/misc/settings.service';
import { MUnitWord } from '../../models/wpp/unit-word';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import { FloatLabel } from "primereact/floatlabel";
import WordsUnitDetail from "./WordsUnitDetail";

export default function WordsUnit() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const subscription = new Subscription();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [newWord, setNewWord] = useState('');
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  // https://stackoverflow.com/questions/30626030/can-you-force-a-react-component-to-rerender-without-calling-setstate
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onNewWordChange = (e: SyntheticEvent) => {
    setNewWord((e.nativeEvent.target as HTMLInputElement).value);
  };

  const onNewWordKeyPress = async (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !newWord) return;
    const o = wordsUnitService.newUnitWord();
    o.WORD = settingsService.autoCorrectInput(newWord);
    setNewWord('');
    const id = await wordsUnitService.create(o);
    o.ID = id as number;
    wordsUnitService.unitWords.push(o);
    onRefresh();
  };

  const onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    wordsUnitService.unitWords = e.value;
    wordsUnitService.reindex(index => onRefresh());
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

  const deleteWord = (item: MUnitWord) => {
    wordsUnitService.delete(item);
  };

  const getNote = async (item: MUnitWord) => {
    const index = wordsUnitService.unitWords.indexOf(item);
    await wordsUnitService.getNote(index);
    onRefresh();
  };

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  const googleWord = (WORD: string) => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  };

  const dictWord = (item: MUnitWord) => {
    const index = wordsUnitService.unitWords.indexOf(item);
    navigate('/words-dict/unit/' + index);
  };

  const getNotes = (ifEmpty: boolean) => {
    wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
  };

  const showDetailDialog = (id: number) => {
    setDetailId(id);
    setShowDialog(true);
  };

  useEffect(() => {
    subscription.add(appService.initializeObject.subscribe(_ => {
      onRefresh();
    }));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    (async () => {
      await wordsUnitService.getDataInTextbook(filter, filterType);
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
      <Button icon="fa fa-book" onClick={() => dictWord(rowData)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Retrieve Note" onClick={() => getNote(rowData)}/>
    </div>;
  };

  const startContent = (
    <>
      <FloatLabel>
        <InputText id="word" value={newWord} onChange={onNewWordChange} onKeyPress={onNewWordKeyPress}/>
        <label htmlFor="word">New Word</label>
      </FloatLabel>
      <Dropdown options={settingsService.wordFilterTypes} value={filterType} onChange={onFilterTypeChange} />
      <FloatLabel>
        <InputText id="filter" value={filter} onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <label htmlFor="Filter">Filter</label>
      </FloatLabel>
      <Button hidden={!settingsService.selectedVoice} icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => settingsService.speak(newWord)} />
      <Button label="Add" icon="fa fa-plus" onClick={() => showDetailDialog(0)} />
      <Button label="Refresh" icon="fa fa-refresh" onClick={onRefresh}/>
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Retrieve All Notes" />
      <Button hidden={!settingsService.selectedDictNote} severity="warning" label="Retrieve Notes If Empty" />
      <Button label="Dictionary" icon="fa fa-book" onClick={() => navigate('/words-dict/unit/0')} />
    </>
  );

  return (
    <div>
      <Toolbar start={startContent} />
      <DataTable value={wordsUnitService.unitWords}
                 onRowReorder={onReorder} selectionMode="single">
        <Column rowReorder={settingsService.selectedTextbook && settingsService.isSingleUnitPart} style={{width: '3em'}} />
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
      {showDialog && <WordsUnitDetail id={detailId} isDialogOpened={showDialog} handleCloseDialog={() => setShowDialog(false)} />}
    </div>
  );
}
