import * as React from 'react';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import { container } from "tsyringe";
import '../misc/Common.css'
import { SettingsService } from '../../view-models/misc/settings.service';
import {
  Button,
  Fab, MenuItem, Select, SelectChangeEvent,
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
  faArrowUp,
  faArrowDown,
  faBook,
  faPlus, faSync,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MUnitWord } from '../../models/wpp/unit-word';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { ChangeEvent, ReactNode, SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import WordsUnitDetail2 from "./WordsUnitDetail2";

export default function WordsUnit2() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [newWord, setNewWord] = useState('');
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
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

  const onFilterChange = (e: SyntheticEvent) => {
    setFilter((e.nativeEvent.target as HTMLInputElement).value);
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onRefresh();
  };

  const onFilterTypeChange = (e: SelectChangeEvent<number>) => {
    setFilterType(e.target.value as number);
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
    setShowDetail(true);
  };

  useEffect(() => {
    (async () => {
      await appService.getData();
      onRefresh();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await wordsUnitService.getDataInTextbook(filter, filterType);
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
    <div>
      <Toolbar>
        <TextField label="New Word" value={newWord}
                   onChange={onNewWordChange} onKeyPress={onNewWordKeyPress}/>
        <Tooltip title="Speak">
          <Fab size="small" color="primary" hidden={!settingsService.selectedVoice}
               onClick={() => settingsService.speak(newWord)}>
            <FontAwesomeIcon icon={faVolumeUp} />
          </Fab>
        </Tooltip>
        <Select
          value={filterType}
          onChange={onFilterTypeChange}
        >
          {settingsService.wordFilterTypes.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <TextField label="Filter" value={filter}
                   onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <Button variant="contained" color="primary" onClick={() => showDetailDialog(0)}>
          <span><FontAwesomeIcon icon={faPlus} />Add</span>
        </Button>
        <Button variant="contained" color="primary" onClick={onRefresh}>
          <span><FontAwesomeIcon icon={faSync} />Refresh</span>
        </Button>
        <Button hidden={!settingsService.selectedDictNote} variant="contained" color="warning">
          Retrieve All Notes
        </Button>
        <Button hidden={!settingsService.selectedDictNote} variant="contained" color="warning">
          Retrieve Notes If Empty
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
                  Retrieve Note
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
