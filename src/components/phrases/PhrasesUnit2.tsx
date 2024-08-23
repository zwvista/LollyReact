import * as React from 'react';
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
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
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
import { MUnitPhrase } from '../../models/wpp/unit-phrase';
import { googleString } from '../../common/common';
import { SyntheticEvent, useEffect, useReducer, useState } from 'react';
import { KeyboardEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { useNavigate } from "react-router-dom";
import PhrasesUnitDetail2 from "./PhrasesUnitDetail2";

export default function PhrasesUnit2() {
  const appService = container.resolve(AppService);
  const phrasesUnitService = container.resolve(PhrasesUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState(0);
  const [refreshCount, onRefresh] = useReducer(x => x + 1, 0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

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
      onRefresh();
    })();
  }, []);

  useEffect(() => {
    if (!appService.isInitialized) return;
    (async () => {
      await phrasesUnitService.getDataInTextbook(filter, filterType);
      forceUpdate();
    })();
  }, [refreshCount]);

  return (
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
        <Button variant="contained" color="primary" onClick={() => showDetailDialog(0)}>
          <span><FontAwesomeIcon icon={faPlus} />Add</span>
        </Button>
        <Button variant="contained" color="primary" onClick={onRefresh}>
          <span><FontAwesomeIcon icon={faSync} />Refresh</span>
        </Button>
      </Toolbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
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
          {phrasesUnitService.unitPhrases.map(row => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
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
      </Table>
      {showDetail && <PhrasesUnitDetail2 id={detailId} isDialogOpened={showDetail} handleCloseDialog={() => setShowDetail(false)} />}
    </div>
  );
}
