import * as React from 'react';
import 'reflect-metadata';
import { resolve } from "inversify-react";
import '../misc/Common.css'
import { Subscription } from 'rxjs';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faPlus, faSync, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { PhrasesLangService } from '../../view-models/wpp/phrases-lang.service';
import { googleString } from '../../common/common';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { ChangeEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { MLangPhrase } from '../../models/wpp/lang-phrase';

export default class PhrasesLang2 extends React.Component<any, any> {
  @resolve appService: AppService;
  @resolve phrasesLangService: PhrasesLangService;
  @resolve settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    rows: 0,
    page: 1,
    filter: '',
    filterType: 0,
  };

  componentDidMount() {
    this.subscription.add(this.appService.initializeObject.subscribe(_ => {
      this.setState({rows: this.state.rows = this.settingsService.USROWSPERPAGE});
      this.onRefresh();
    }));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return !this.appService.isInitialized ? (<div/>) : (
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
          <Button variant="contained" color="primary" onClick={() => this.props.history.push('/phrases-lang-detail/0')}>
            <span><FontAwesomeIcon icon={faPlus} />Add</span>
          </Button>
          <Button variant="contained" color="primary" onClick={(e: any) => this.onRefresh}>
            <span><FontAwesomeIcon icon={faSync} />Refresh</span>
          </Button>
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}
                colSpan={4}
                count={this.phrasesLangService.langPhraseCount}
                rowsPerPage={this.state.rows}
                page={this.state.page - 1}
                SelectProps={{
                  native: true,
                }}
                onPageChange={this.handleChangePage}
                onRowsPerPageChange={this.handleRowsPerPageChange}
              />
            </TableRow>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>PHRASE</TableCell>
              <TableCell>TRANSLATION</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.phrasesLangService.langPhrases.map(row => (
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.PHRASE}</TableCell>
                <TableCell>{row.TRANSLATION}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <Fab size="small" color="secondary" onClick={() => this.deletePhrase(row)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Fab size="small" color="primary" onClick={() => this.props.history.push('/phrases-lang-detail/' + row.ID)}>
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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}
                colSpan={4}
                count={this.phrasesLangService.langPhraseCount}
                rowsPerPage={this.state.rows}
                page={this.state.page - 1}
                SelectProps={{
                  native: true,
                }}
                onPageChange={this.handleChangePage}
                onRowsPerPageChange={this.handleRowsPerPageChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }

  handleChangePage = (event: any, page: any) => {
    this.setState({ page: this.state.page = page + 1 });
    this.onRefresh();
  };

  handleRowsPerPageChange = (event: any) => {
    this.setState({ page: this.state.page = 1, rows: this.state.rows = event.target.value });
    this.onRefresh();
  };

  onRefresh = async () => {
    await this.phrasesLangService.getData(this.state.page, this.state.rows, this.state.filter, this.state.filterType);
    this.updateServiceState();
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    this.onRefresh();
  };

  onFilterTypeChange = (e: SelectChangeEvent<number>, child: ReactNode) => {
    this.setState({filterType: this.state.filterType = Number(e.target.value)});
    this.onRefresh();
  };

  deletePhrase(item: MLangPhrase) {
    this.phrasesLangService.delete(item);
  }

  updateServiceState() {
    this.setState({phrasesLangService: this.phrasesLangService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

