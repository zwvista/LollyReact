import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import {
  Button,
  Fab, MenuItem, Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
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
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MUnitPhrase } from '../models/unit-phrase';
import { googleString } from '../common/common';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { ChangeEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../view-models/app.service';

export default class PhrasesUnit2 extends React.Component<any, any> {
  @Inject appService: AppService;
  @Inject phrasesUnitService: PhrasesUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    filter: '',
    filterType: 0,
  };

  componentDidMount() {
    this.subscription.add(this.appService.initializeObject.subscribe(_ => {
      this.onRefresh();
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div>
        <Toolbar>
          <Select
            value={this.state.filterType}
            onChange={this.onFilterTypeChange}
          >
            {this.settingsService.phraseFilterTypes.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
          <TextField label="Filter" value={this.state.filter}
                     onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
          <Button variant="contained" color="primary" onClick={() => history.push('/phrases-unit-detail/0')}>
            <span><FontAwesomeIcon icon={faPlus} />Add</span>
          </Button>
          <Button variant="contained" color="primary" onClick={this.onRefresh}>
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
            {this.phrasesUnitService.unitPhrases.map(row => (
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
                    <Fab size="small" color="secondary" onClick={() => this.deletePhrase(row)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Fab size="small" color="primary" onClick={() => history.push('/phrases-unit-detail/' + row.ID)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Speak">
                    <Fab size="small" color="primary" hidden={!this.settingsService.selectedVoice}
                         onClick={() => this.settingsService.speak(row.PHRASE)}>
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
                  <Tooltip title="Google Word" onClick={() => this.googlePhrase(row.PHRASE)}>
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faGoogle} />
                    </Fab>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  onRefresh = () => {
    this.subscription.add(this.phrasesUnitService.getDataInTextbook(this.state.filter, this.state.filterType).subscribe(
      _ => this.updateServiceState()
    ));
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (this.state.filter && this.state.filterType === 0)
      this.setState({filterType: this.state.filterType = 1});
    else if (!this.state.filter && this.state.filterType !== 0)
      this.setState({filterType: this.state.filterType = 0});
    this.onRefresh();
  };

  onFilterTypeChange = (e: ChangeEvent<HTMLSelectElement>, child: ReactNode) => {
    this.setState({filterType: this.state.filterType = Number(e.target.value)});
    this.onRefresh();
  };

  deletePhrase(item: MUnitPhrase) {
    this.phrasesUnitService.delete(item);
  }

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

  updateServiceState() {
    this.setState({phrasesUnitService: this.phrasesUnitService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

