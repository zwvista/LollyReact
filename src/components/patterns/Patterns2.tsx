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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faPlus, faSync, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { googleString } from '../../shared/common/common';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../shared/view-models/misc/app.service';
import { PatternsService } from '../../shared/view-models/wpp/patterns.service';
import { useNavigate } from "react-router-dom";
import PatternsDetail2 from "./PatternsDetail2";

export default function Patterns2() {
  const appService = container.resolve(AppService);
  const patternsService = container.resolve(PatternsService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [reloadCount, onReload] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleChangePage = (event: any, page: any) => {
    patternsService.page = page + 1;
    onReload();
  };

  const handleRowsPerPageChange = (event: any) => {
    patternsService.page = 1;
    patternsService.rows = event.target.value;
    onReload();
  };

  const onFilterChange = (e: SyntheticEvent) => {
    patternsService.filter = (e.nativeEvent.target as HTMLInputElement).value;
    onReload();
  };

  const onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    onReload();
  };

  const onFilterTypeChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    patternsService.filterType = Number(e.target.value);
    onReload();
  };

  const deletePattern = async (id: number) => {
    await patternsService.delete(id);
  };

  const googlePattern = (pattern: string) => {
    googleString(pattern);
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
      await patternsService.getData();
      forceUpdate();
    })();
  }, [reloadCount]);

  return !appService.isInitialized ? (<div/>) : (
    <div>
      <Toolbar>
        <Select
          value={patternsService.filterType}
          onChange={onFilterTypeChange}
        >
          {settingsService.patternFilterTypes.map(row =>
            <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
          )}
        </Select>
        <TextField label="Filter" value={patternsService.filter}
                   onChange={onFilterChange} onKeyPress={onFilterKeyPress}/>
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
              colSpan={4}
              count={patternsService.patternCount}
              rowsPerPage={patternsService.rows}
              page={patternsService.page - 1}
              SelectProps={{
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableRow>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>PATTERN</TableCell>
            <TableCell>TAGS</TableCell>
            <TableCell>TITLE</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>ACTIONS</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patternsService.patterns.map(row => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
              <TableCell>{row.PATTERN}</TableCell>
              <TableCell>{row.TAGS}</TableCell>
              <TableCell>{row.TITLE}</TableCell>
              <TableCell>{row.URL}</TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <Fab size="small" color="secondary" onClick={() => deletePattern(row.ID)}>
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
                       onClick={() => settingsService.speak(row.PATTERN)}>
                    <FontAwesomeIcon icon={faVolumeUp} />
                  </Fab>
                </Tooltip>
                <CopyToClipboard text={row.PATTERN}>
                  <Tooltip title="Copy">
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faCopy} />
                    </Fab>
                  </Tooltip>
                </CopyToClipboard>
                <Tooltip title="Google Word" onClick={() => googlePattern(row.PATTERN)}>
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
              colSpan={4}
              count={patternsService.patternCount}
              rowsPerPage={patternsService.rows}
              page={patternsService.page - 1}
              SelectProps={{
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableRow>
        </TableFooter>
      </Table>
      {showDetail && <PatternsDetail2 id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
