import * as React from 'react';
import { container } from "tsyringe";
import '../misc/Common.css'
import { SettingsService } from '../../view-models/misc/settings.service';
import {
  Button,
  Fab, MenuItem, Select, SelectChangeEvent,
  Table,
  TableBody,
  TableCell, TableFooter,
  TableHead,
  TablePagination,
  TableRow, TextField,
  Toolbar,
  Tooltip
} from '@mui/material';
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faPlus, faSync, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { googleString } from '../../common/common';
import { MUnitPhrase } from '../../models/wpp/unit-phrase';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import PhrasesTextbookDetail2 from "./PhrasesTextbookDetail2";

export default function PhrasesTextbook2() {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
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

  const deletePhrase = (item: MUnitPhrase) => {
    phrasesUnitService.delete(item);
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
      setRows(settingsService.USROWSPERPAGE);
      onRefresh();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await phrasesUnitService.getDataInLang(page, rows, filter, filterType, textbookFilter);
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
          {settingsService.phraseFilterTypes.map(row =>
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
        <Button variant="contained" color="primary" onClick={() => showDetailDialog(0)}>
          <span><FontAwesomeIcon icon={faPlus} />Add</span>
        </Button>
        <Button variant="contained" color="primary" onClick={(e: any) => onRefresh}>
          <span><FontAwesomeIcon icon={faSync} />Refresh</span>
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}
              colSpan={9}
              count={phrasesUnitService.textbookPhraseCount}
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
            <TableCell>PHRASEID</TableCell>
            <TableCell>PHRASE</TableCell>
            <TableCell>TRANSLATION</TableCell>
            <TableCell>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {phrasesUnitService.textbookPhrases.map(row => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
              <TableCell>{row.TEXTBOOKNAME}</TableCell>
              <TableCell>{row.UNITSTR}</TableCell>
              <TableCell>{row.PARTSTR}</TableCell>
              <TableCell>{row.SEQNUM}</TableCell>
              <TableCell>{row.PHRASEID}</TableCell>
              <TableCell>{row.PHRASE}</TableCell>
              <TableCell>{row.TRANSLATION}</TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <Fab size="small" color="secondary" onClick={() => deletePhrase(row)}>
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
                       onClick={() => settingsService.speak(row.PHRASE)}>
                    <FontAwesomeIcon icon={faVolumeUp} />
                  </Fab>
                </Tooltip>
                <CopyToClipboard text={row.PHRASE}>
                  <Tooltip title="Copy">
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faCopy} />
                    </Fab>
                  </Tooltip>
                </CopyToClipboard>
                <Tooltip title="Google Word" onClick={() => googlePhrase(row.PHRASE)}>
                  <Fab size="small" color="primary">
                    <FontAwesomeIcon icon={faGoogle} />
                  </Fab>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={settingsService.USROWSPERPAGEOPTIONS}
              colSpan={9}
              count={phrasesUnitService.textbookPhraseCount}
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
      {showDetail && <PhrasesTextbookDetail2 id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
