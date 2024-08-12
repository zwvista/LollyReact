import * as React from 'react';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import 'reflect-metadata';
import { container } from "tsyringe";
import '../misc/Common.css'
import { SettingsService } from '../../view-models/misc/settings.service';
import {
  Button,
  Fab, MenuItem, Select, SelectChangeEvent,
  Table,
  TableBody,
  TableCell, TableFooter,
  TableHead, TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faBook,
  faCopy,
  faEdit,
  faPlus, faSync,
  faTrash,
  faVolumeUp
} from '@fortawesome/free-solid-svg-icons';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MUnitWord } from '../../models/wpp/unit-word';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import WordsTextbookDetail from "./WordsTextbookDetail";
import WordsTextbookDetail2 from "./WordsTextbookDetail2";

export default function WordsTextbook2() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [textbookFilter, setTextbookFilter] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChangePage = (event: any, page: any) => {
    setPage(page + 1);
    onRefresh();
  };

  const handleRowsPerPageChange = (event: any) => {
    setPage(1);
    setRows(event.target.value);
    onRefresh();
  };

  const onFilterChange = (e: SyntheticEvent) => {
    setFilter((e.nativeEvent.target as HTMLInputElement).value);
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onRefresh();
  };

  const onFilterTypeChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    setFilterType(Number(e.target.value));
    onRefresh();
  };

  const onTextbookFilterChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    setTextbookFilter(Number(e.target.value));
    onRefresh();
  };

  const deleteWord = (item: MUnitWord) => {
    wordsUnitService.delete(item);
  };

  const getNote = async (index: number) => {
    console.log(index);
    await wordsUnitService.getNote(index);
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

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar>
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
        <Select
          value={textbookFilter}
          onChange={onTextbookFilterChange}
        >
          {settingsService.textbookFilters.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <Button variant="contained" color="primary" onClick={(e: any) => onRefresh}>
          <span><FontAwesomeIcon icon={faSync} />Refresh</span>
        </Button>
        <Button variant="contained" color="primary" onClick={() => showDetailDialog(0)}>
          <span><FontAwesomeIcon icon={faBook} />Dictionary</span>
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}
              colSpan={10}
              count={wordsUnitService.textbookWordCount}
              rowsPerPage={rows}
              page={page - 1}
              SelectProps={{
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableRow>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>TEXTBOOKNAME</TableCell>
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
          {wordsUnitService.textbookWords.map(row => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
              <TableCell>{row.TEXTBOOKNAME}</TableCell>
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
                        onClick={() => getNote(row.ID)}>
                  Retrieve Note
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}
              colSpan={10}
              count={wordsUnitService.textbookWordCount}
              rowsPerPage={rows}
              page={page - 1}
              SelectProps={{
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
      {showDetail && <WordsTextbookDetail2 id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
