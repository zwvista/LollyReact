import * as React from 'react';
import { WordsUnitService } from '../../shared/view-models/wpp/words-unit.service';
import { container } from "tsyringe";
import '../misc/Common.css'
import { SettingsService } from '../../shared/view-models/misc/settings.service';
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
  faBook,
  faCopy,
  faEdit,
  faSync,
  faTrash,
  faVolumeUp
} from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MUnitWord } from '../../shared/models/wpp/unit-word';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import WordsTextbookDetail2 from "./WordsTextbookDetail2";

export default function WordsTextbook2() {
  const appService = container.resolve(AppService);
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChangePage = (event: any, page: any) => {
    wordsUnitService.page = page + 1;
    onReload();
  };

  const handleRowsPerPageChange = (event: any) => {
    wordsUnitService.page = 1;
    wordsUnitService.rows = event.target.value;
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

  const onFilterTypeChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    wordsUnitService.filterType = Number(e.target.value);
    onReload();
  };

  const onTextbookFilterChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    wordsUnitService.textbookFilter = Number(e.target.value);
    onReload();
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
      onReload();
    })();
  }, []);

  useEffect(() => {
    if (!appService.isInitialized) return;
    (async () => {
      // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
      await wordsUnitService.getDataInLang();
      forceUpdate();
    })();
  }, [reloadCount]);

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar>
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
        <Select
          value={wordsUnitService.textbookFilter}
          onChange={onTextbookFilterChange}
        >
          {settingsService.textbookFilters.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <Button variant="contained" color="primary" onClick={(e: any) => onReload()}>
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
              rowsPerPage={wordsUnitService.rows}
              page={wordsUnitService.page - 1}
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
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}
              colSpan={10}
              count={wordsUnitService.textbookWordCount}
              rowsPerPage={wordsUnitService.rows}
              page={wordsUnitService.page - 1}
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
