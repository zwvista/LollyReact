import * as React from 'react';
import { container } from "tsyringe";
import '../misc/Common.css'
import { SettingsService } from '../../shared/view-models/misc/settings.service';
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
import { PhrasesUnitService } from '../../shared/view-models/wpp/phrases-unit.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faPlus, faSync, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { googleString } from '../../shared/common/common';
import { MUnitPhrase } from '../../shared/models/wpp/unit-phrase';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import PhrasesTextbookDetail2 from "./PhrasesTextbookDetail2";

export default function PhrasesTextbook2() {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChangePage = (event: any, page: any) => {
    phrasesUnitService.page = page + 1;
    onReload();
  };

  const handleRowsPerPageChange = (event: any) => {
    phrasesUnitService.page = 1;
    phrasesUnitService.rows = event.target.value;
    onReload();
  };

  const onFilterChange = (e: SyntheticEvent) => {
    phrasesUnitService.filter = (e.nativeEvent.target as HTMLInputElement).value;
    onReload();
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterTypeChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    phrasesUnitService.filterType = Number(e.target.value);
    onReload();
  };

  const onTextbookFilterChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    phrasesUnitService.textbookFilter = Number(e.target.value);
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
      phrasesUnitService.rows = settingsService.USROWSPERPAGE;
      onReload();
    })();
  }, []);

  useEffect(() => {
    if (!appService.isInitialized) return;
    (async () => {
      await phrasesUnitService.getDataInLang();
      forceUpdate();
    })();
  }, [reloadCount]);

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar>
        <Select
          value={phrasesUnitService.filterType}
          onChange={onFilterTypeChange}
        >
          {settingsService.phraseFilterTypes.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <TextField label="Filter" value={phrasesUnitService.filter}
                   onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
        <Select
          value={phrasesUnitService.textbookFilter}
          onChange={onTextbookFilterChange}
        >
          {settingsService.textbookFilters.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <Button variant="contained" color="primary" onClick={() => showDetailDialog(0)}>
          <span><FontAwesomeIcon icon={faPlus} />Add</span>
        </Button>
        <Button variant="contained" color="primary" onClick={(e: any) => onReload()}>
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
              rowsPerPage={phrasesUnitService.rows}
              page={phrasesUnitService.page - 1}
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
              rowsPerPage={phrasesUnitService.rows}
              page={phrasesUnitService.page - 1}
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
