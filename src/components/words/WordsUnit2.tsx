import * as React from 'react';
import { WordsUnitService } from '../../shared/view-models/wpp/words-unit.service';
import { container } from "tsyringe";
import '../misc/Common.css'
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import {
  Button,
  Fab, FormControlLabel, MenuItem, Select, SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip
} from '@mui/material';
import {
  faTrash,
  faEdit,
  faVolumeUp,
  faCopy,
  faBook,
  faPlus, faSync,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MUnitWord } from '../../shared/models/wpp/unit-word';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import WordsUnitDetail2 from "./WordsUnitDetail2";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

export default function WordsUnit2() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
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

  const onFilterChange = (e: SyntheticEvent) => {
    wordsUnitService.filter = (e.nativeEvent.target as HTMLInputElement).value;
    onReload();
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterTypeChange = (e: SelectChangeEvent<number>) => {
    wordsUnitService.filterType = e.target.value as number;
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

  const googleWord = (WORD: string) => {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  };

  const dictWord = (item: MUnitWord) => {
    const index = wordsUnitService.unitWords.indexOf(item);
    navigate('/words-dict/unit/' + index);
  };

  const onIfEmptyChange = (e: CheckboxChangeEvent) => {
    wordsUnitService.ifEmpty = e.checked;
  }

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

  return (
    <div>
      <Toolbar>
        <TextField label="New Word" value={wordsUnitService.newWord}
                   onChange={onNewWordChange} onKeyPress={onNewWordKeyPress}/>
        <Tooltip title="Speak">
          <Fab size="small" color="primary" hidden={!settingsService.selectedVoice}
               onClick={() => settingsService.speak(wordsUnitService.newWord)}>
            <FontAwesomeIcon icon={faVolumeUp} />
          </Fab>
        </Tooltip>
        <Select
          value={wordsUnitService.filterType}
          onChange={onFilterTypeChange}
        >
          {settingsService.wordFilterTypes.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <TextField label="Filter" value={wordsUnitService.filter}
                   onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <Button variant="contained" color="primary" onClick={() => showDetailDialog(0)}>
          <span><FontAwesomeIcon icon={faPlus} />Add</span>
        </Button>
        <Button variant="contained" color="primary" onClick={onReload}>
          <span><FontAwesomeIcon icon={faSync} />Refresh</span>
        </Button>
        <FormControlLabel control={<Checkbox checked={wordsUnitService.ifEmpty} onChange={onIfEmptyChange} />} label="If Empty" />
        <Button hidden={!settingsService.selectedDictNote} variant="contained" color="warning" onClick={() => getNotes()}>
          Get Notes
        </Button>
        <Button hidden={!settingsService.selectedDictNote} variant="contained" color="warning" onClick={() => clearNotes()}>
          Clear Notes
        </Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/words-dict/unit/0')}>
          <span><FontAwesomeIcon icon={faBook} />Dictionary</span>
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>UNIT</TableCell>
            <TableCell>PART</TableCell>
            <TableCell>SEQNUM</TableCell>
            <TableCell>WORDID</TableCell>
            <TableCell>WORD</TableCell>
            <TableCell>NOTE</TableCell>
            <TableCell>ACCURACY</TableCell>
            <TableCell>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wordsUnitService.unitWords.map(row => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
              <TableCell>{row.UNITSTR}</TableCell>
              <TableCell>{row.PARTSTR}</TableCell>
              <TableCell>{row.SEQNUM}</TableCell>
              <TableCell>{row.WORDID}</TableCell>
              <TableCell>{row.WORD}</TableCell>
              <TableCell>{row.NOTE}</TableCell>
              <TableCell>{row.ACCURACY}</TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <Fab size="small" color="secondary" onClick={() => deleteWord(row)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Fab>
                </Tooltip>
                <Tooltip title="Edit">
                  <Fab size="small" color="primary" onClick={() => showDetailDialog(row.ID)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Fab>
                </Tooltip>
                <Tooltip title="Speak">
                  <Fab size="small" color="primary" hidden={!settingsService.selectedVoice}
                       onClick={() => settingsService.speak(row.WORD)}>
                    <FontAwesomeIcon icon={faVolumeUp} />
                  </Fab>
                </Tooltip>
                <CopyToClipboard text={row.WORD}>
                  <Tooltip title="Copy">
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faCopy} />
                    </Fab>
                  </Tooltip>
                </CopyToClipboard>
                <Tooltip title="Google Word" onClick={() => googleWord(row.WORD)}>
                  <Fab size="small" color="primary">
                    <FontAwesomeIcon icon={faGoogle} />
                  </Fab>
                </Tooltip>
                <Tooltip title="Dictionary" onClick={() => dictWord(row)}>
                  <Fab size="small" color="primary">
                    <FontAwesomeIcon icon={faBook} />
                  </Fab>
                </Tooltip>
                <Button variant="contained" color="warning" hidden={!settingsService.selectedDictNote}
                        onClick={() => getNote(row)}>
                  Get Note
                </Button>
                <Button variant="contained" color="warning" hidden={!settingsService.selectedDictNote}
                        onClick={() => clearNote(row)}>
                  Clear Note
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showDetail && <WordsUnitDetail2 id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
