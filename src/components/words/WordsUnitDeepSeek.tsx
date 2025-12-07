import * as React from 'react';
import { KeyboardEvent, SyntheticEvent, useEffect, useReducer, useState, useCallback } from 'react';
import { WordsUnitService } from '../../shared/view-models/wpp/words-unit.service';
import { container } from "tsyringe";
import { DataTable, DataTableRowReorderEvent } from 'primereact/datatable';
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
import { ProgressSpinner } from 'primereact/progressspinner';

export default function WordsUnit() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();

  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);
  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Event handlers with useCallback - 必须放在所有条件渲染之前
  const onNewWordChange = useCallback((e: SyntheticEvent) => {
    wordsUnitService.newWord = (e.nativeEvent.target as HTMLInputElement).value;
    forceUpdate();
  }, []);

  const onNewWordKeyPress = useCallback(async (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !wordsUnitService.newWord) return;

    setIsLoading(true);
    try {
      await wordsUnitService.createWithNewWord();
      onReload();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onReorder = useCallback((e: DataTableRowReorderEvent<MUnitWord[]>) => {
    wordsUnitService.unitWords = e.value;
    wordsUnitService.reindex(() => onReload());
  }, []);

  const onFilterChange = useCallback((e: SyntheticEvent) => {
    wordsUnitService.filter = (e.nativeEvent.target as HTMLInputElement).value;
    forceUpdate();
  }, []);

  const onFilterKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  }, []);

  const onFilterTypeChange = useCallback((e: DropdownChangeEvent) => {
    wordsUnitService.filterType = e.value;
    onReload();
  }, []);

  const deleteWord = useCallback(async (item: MUnitWord) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;

    setIsLoading(true);
    try {
      await wordsUnitService.delete(item);
      onReload();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNote = useCallback(async (item: MUnitWord) => {
    setIsLoading(true);
    try {
      await wordsUnitService.getNote(item);
      onReload();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearNote = useCallback(async (item: MUnitWord) => {
    setIsLoading(true);
    try {
      await wordsUnitService.clearNote(item);
      onReload();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const googleWord = useCallback((word: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(word)}`, '_blank');
  }, []);

  const dictWord = useCallback((item: MUnitWord) => {
    const index = wordsUnitService.unitWords.indexOf(item);
    navigate(`/words-dict/unit/${index}`);
  }, [navigate]);

  const setIfEmpty = useCallback((checked: boolean) => {
    wordsUnitService.ifEmpty = checked;
    onReload();
  }, []);

  const getNotes = useCallback(() => {
    setIsLoading(true);
    wordsUnitService.getNotes(
      () => {
        onReload();
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  const clearNotes = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all notes?')) return;

    setIsLoading(true);
    wordsUnitService.clearNotes(
      () => {
        onReload();
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  const showDetailDialog = useCallback((id: number) => {
    setDetailId(id);
    setShowDetail(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowDetail(false);
    onReload();
  }, []);

  // 这个 useCallback 也必须放在条件渲染之前
  const actionTemplate = useCallback((rowData: MUnitWord) => {
    // 在这里安全地访问 settingsService，因为只有在初始化后才会调用这个函数
    const canShowVoiceButton = !!settingsService.selectedVoice;
    const canShowDictNoteButtons = !!settingsService.selectedDictNote;

    return (
      <div className="flex flex-wrap gap-1">
        <Button
          severity="danger"
          icon="fa fa-trash"
          tooltip="Delete"
          tooltipOptions={{ position: 'top' }}
          onClick={() => deleteWord(rowData)}
          disabled={isLoading}
        />
        <Button
          icon="fa fa-edit"
          tooltip="Edit"
          tooltipOptions={{ position: 'top' }}
          onClick={() => showDetailDialog(rowData.ID)}
          disabled={isLoading}
        />
        {canShowVoiceButton && (
          <Button
            icon="fa fa-volume-up"
            tooltipOptions={{ position: 'top' }}
            tooltip="Speak"
            onClick={() => settingsService.speak(rowData.WORD)}
            disabled={isLoading}
          />
        )}
        <CopyToClipboard text={rowData.WORD}>
          <Button
            icon="fa fa-copy"
            tooltip="Copy"
            tooltipOptions={{ position: 'top' }}
            disabled={isLoading}
          />
        </CopyToClipboard>
        <Button
          icon="fa fa-google"
          onClick={() => googleWord(rowData.WORD)}
          tooltip="Google Word"
          tooltipOptions={{ position: 'top' }}
          disabled={isLoading}
        />
        <Button
          icon="fa fa-book"
          onClick={() => dictWord(rowData)}
          tooltip="Dictionary"
          tooltipOptions={{ position: 'top' }}
          disabled={isLoading}
        />
        {canShowDictNoteButtons && (
          <>
            <Button
              severity="warning"
              label="Get Note"
              onClick={() => getNote(rowData)}
              disabled={isLoading}
              size="small"
            />
            <Button
              severity="warning"
              label="Clear Note"
              onClick={() => clearNote(rowData)}
              disabled={isLoading}
              size="small"
            />
          </>
        )}
      </div>
    );
  }, [isLoading, deleteWord, showDetailDialog, googleWord, dictWord, getNote, clearNote]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setIsLoading(true);
        await appService.getData();
        if (mounted) {
          setIsInitialized(true);
          onReload(); // 触发数据加载
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        if (mounted) {
          setIsInitialized(true); // 即使出错也设置为已初始化，避免无限加载
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    (async () => {
      setIsLoading(true);
      try {
        await wordsUnitService.getDataInTextbook();
        forceUpdate();
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reloadCount, isInitialized]);

  // 如果应用未初始化，显示加载界面
  if (!isInitialized) {
    return (
      <div className="flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <ProgressSpinner />
        <span className="ml-3">Loading application data...</span>
      </div>
    );
  }

  // 只有在初始化后才计算这些值
  const canShowDictNoteButtons = !!settingsService.selectedDictNote;
  const canShowReorderColumn = !!settingsService.selectedTextbook && !!settingsService.isSingleUnitPart;
  const canShowVoiceButton = !!settingsService.selectedVoice;

  const startContent = (
    <div className="flex flex-wrap align-items-center gap-3">
      <div className="flex-1 min-w-20rem">
        <FloatLabel>
          <InputText
            id="word"
            value={wordsUnitService.newWord}
            onChange={onNewWordChange}
            onKeyPress={onNewWordKeyPress}
            disabled={isLoading}
            className="w-full"
          />
          <label htmlFor="word">New Word</label>
        </FloatLabel>
      </div>

      {canShowVoiceButton && (
        <Button
          icon="fa fa-volume-up"
          tooltipOptions={{ position: 'top' }}
          tooltip="Speak"
          onClick={() => settingsService.speak(wordsUnitService.newWord)}
          disabled={isLoading}
        />
      )}

      <Dropdown
        options={settingsService.wordFilterTypes || []}
        value={wordsUnitService.filterType}
        onChange={onFilterTypeChange}
        disabled={isLoading}
        className="w-10rem"
      />

      <div className="flex-1 min-w-15rem">
        <FloatLabel>
          <InputText
            id="filter"
            value={wordsUnitService.filter}
            onChange={onFilterChange}
            onKeyPress={onFilterKeyPress}
            disabled={isLoading}
            className="w-full"
          />
          <label htmlFor="filter">Filter</label>
        </FloatLabel>
      </div>

      <Button
        label="Add"
        icon="fa fa-plus"
        onClick={() => showDetailDialog(0)}
        disabled={isLoading}
      />

      <Button
        label="Refresh"
        icon="fa fa-refresh"
        onClick={onReload}
        disabled={isLoading}
      />

      <div className="flex align-items-center gap-2">
        <Checkbox
          inputId="ifEmpty"
          checked={wordsUnitService.ifEmpty}
          onChange={e => setIfEmpty(e.checked as boolean)}
          disabled={isLoading}
        />
        <label htmlFor="ifEmpty" className="ml-2">If Empty</label>
        <InputSwitch
          checked={wordsUnitService.ifEmpty}
          onChange={e => setIfEmpty(e.value)}
          disabled={isLoading}
        />
      </div>

      {canShowDictNoteButtons && (
        <>
          <Button
            severity="warning"
            label="Get Notes"
            onClick={getNotes}
            disabled={isLoading}
            size="small"
          />
          <Button
            severity="warning"
            label="Clear Notes"
            onClick={clearNotes}
            disabled={isLoading}
            size="small"
          />
        </>
      )}

      <Button
        label="Dictionary"
        icon="fa fa-book"
        onClick={() => navigate('/words-dict/unit/0')}
        disabled={isLoading}
      />

      {isLoading && <i className="pi pi-spin pi-spinner ml-2" />}
    </div>
  );

  return (
    <div className="p-3">
      <Toolbar start={startContent} />
      <div className="mt-3">
        <DataTable
          value={wordsUnitService.unitWords}
          onRowReorder={canShowReorderColumn ? onReorder : undefined}
          selectionMode="single"
          loading={isLoading}
          removableSort
          paginator
          rows={25}
          rowsPerPageOptions={[10, 25, 50, 100]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          emptyMessage="No words found"
        >
          {canShowReorderColumn && (
            <Column
              rowReorder
              style={{ width: '3em' }}
              headerStyle={{ width: '3em' }}
            />
          )}
          <Column style={{ width: '80px' }} field="ID" header="ID" sortable />
          <Column style={{ width: '80px' }} field="UNITSTR" header="UNIT" sortable />
          <Column style={{ width: '80px' }} field="PARTSTR" header="PART" sortable />
          <Column style={{ width: '80px' }} field="SEQNUM" header="SEQ" sortable />
          <Column style={{ width: '80px' }} field="WORDID" header="WORD ID" sortable />
          <Column field="WORD" header="WORD" sortable />
          <Column field="NOTE" header="NOTE" sortable />
          <Column style={{ width: '80px' }} field="ACCURACY" header="ACC%" sortable />
          <Column
            style={{ minWidth: '400px' }}
            body={actionTemplate}
            header="ACTIONS"
          />
        </DataTable>
      </div>

      {showDetail && (
        <WordsUnitDetail
          id={detailId}
          isDialogOpened={showDetail}
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </div>
  );
}
