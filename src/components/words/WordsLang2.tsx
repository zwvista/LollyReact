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
  TableHead, TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip
} from '@mui/material';
import { WordsLangService } from '../../view-models/wpp/words-lang.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faBook,
  faCopy,
  faEdit,
  faPlus,
  faSync,
  faTrash,
  faVolumeUp
} from '@fortawesome/free-solid-svg-icons';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import * as $ from 'jquery';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MLangWord } from '../../models/wpp/lang-word';
import { ChangeEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../view-models/misc/app.service';

export default class WordsLang2 extends React.Component<any, any> {
  @resolve appService: AppService;
  @resolve wordsLangService: WordsLangService;
  @resolve settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
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
          <TextField label="New Word" value={this.state.newWord}
                     onChange={this.onNewWordChange} onKeyPress={this.onNewWordKeyPress}/>
          <Tooltip title="Speak">
            <Fab size="small" color="primary" hidden={!this.settingsService.selectedVoice}
                 onClick={() => this.settingsService.speak(this.state.newWord)}>
              <FontAwesomeIcon icon={faVolumeUp} />
            </Fab>
          </Tooltip>
          <Select
            value={this.state.filterType}
            onChange={this.onFilterTypeChange}
          >
            {this.settingsService.wordFilterTypes.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
          <TextField label="Filter" value={this.state.filter}
                     onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
          <Button variant="contained" color="primary" onClick={() => this.props.history.push('/words-lang-detail/0')}>
            <span><FontAwesomeIcon icon={faPlus} />Add</span>
          </Button>
          <Button variant="contained" color="primary" onClick={(e: any) => this.onRefresh}>
            <span><FontAwesomeIcon icon={faSync} />Refresh</span>
          </Button>
          <Button variant="contained" color="primary" onClick={() => this.props.history.push('/words-dict/lang/0')}>
            <span><FontAwesomeIcon icon={faBook} />Dictionary</span>
          </Button>
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}
                colSpan={5}
                count={this.wordsLangService.langWordsCount}
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
              <TableCell>WORD</TableCell>
              <TableCell>NOTE</TableCell>
              <TableCell>ACCURACY</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.wordsLangService.langWords.map(row => (
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.WORD}</TableCell>
                <TableCell>{row.NOTE}</TableCell>
                <TableCell>{row.ACCURACY}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <Fab size="small" color="secondary" onClick={() => this.deleteWord(row)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Fab size="small" color="primary" onClick={() => this.props.history.push('/words-lang-detail/' + row.ID)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Speak">
                    <Fab size="small" color="primary" hidden={!this.settingsService.selectedVoice}
                         onClick={() => this.settingsService.speak(row.WORD)}>
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
                  <Tooltip title="Google Word" onClick={() => this.googleWord(row.WORD)}>
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faGoogle} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Dictionary" onClick={() => this.dictWord(row)}>
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faBook} />
                    </Fab>
                  </Tooltip>
                  <Button variant="contained" hidden={!this.settingsService.selectedDictNote}
                          onClick={() => this.getNote(row.ID)}>
                    Retrieve Note
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}
                colSpan={5}
                count={this.wordsLangService.langWordsCount}
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

  onNewWordChange = (e: SyntheticEvent) => {
    this.setState({newWord: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onNewWordKeyPress = async (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !this.state.newWord) return;
    const o = this.wordsLangService.newLangWord();
    o.WORD = this.settingsService.autoCorrectInput(this.state.newWord);
    this.setState({newWord: ''});
    this.updateServiceState();
    const id = await this.wordsLangService.create(o);
    o.ID = id as number;
    this.wordsLangService.langWords.push(o);
  };

  handleChangePage = (event: any, page: any) => {
    this.setState({ page: this.state.page = page + 1 });
    this.onRefresh();
  };

  handleRowsPerPageChange = (event: any) => {
    this.setState({ page: this.state.page = 1, rows: this.state.rows = event.target.value });
    this.onRefresh();
  };

  onRefresh = async () => {
    await this.wordsLangService.getData(this.state.page, this.state.rows, this.state.filter, this.state.filterType);
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

  deleteWord(item: MLangWord) {
    this.wordsLangService.delete(item);
  }

  async getNote(index: number) {
    console.log(index);
    await this.wordsLangService.getNote(index);
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  dictWord(item: MLangWord) {
    const index = this.wordsLangService.langWords.indexOf(item);
    this.props.history.push('/words-dict/lang/' + index);
  }

  updateServiceState() {
    this.setState({wordsLangService: this.wordsLangService});
  }
};

