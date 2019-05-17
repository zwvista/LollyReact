import * as React from 'react';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import {
  Button,
  Fab,
  Table,
  TableBody,
  TableCell, TableFooter,
  TableHead, TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import { WordsLangService } from '../view-models/words-lang.service';
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
import history from '../view-models/history';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import * as $ from 'jquery';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MLangWord } from '../models/lang-word';

export default class WordsLang2 extends React.Component<any, any> {
  @Inject wordsLangService: WordsLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
    rows: this.settingsService.USROWSPERPAGE,
    page: 1,
  };

  componentDidMount() {
    this.onRefresh(this.state.page, this.state.rows);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
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
          <Button variant="contained" color="primary" onClick={() => history.push('/words-lang-detail/0')}>
            <span><FontAwesomeIcon icon={faPlus} />Add</span>
          </Button>
          <Button variant="contained" color="primary" onClick={(e: any) => this.onRefresh(this.state.page, this.state.rows)}>
            <span><FontAwesomeIcon icon={faSync} />Refresh</span>
          </Button>
          <Button variant="contained" color="primary" onClick={() => history.push('/words-dict/lang/0')}>
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
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </TableRow>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>WORD</TableCell>
              <TableCell>NOTE</TableCell>
              <TableCell>LEVEL</TableCell>
              <TableCell>ACCURACY</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.wordsLangService.langWords.map(row => (
              <TableRow key={row.ID} style={{backgroundColor:row.colorStyle['background-color']}}>
                <TableCell style={{color:row.colorStyle['color']}}>{row.ID}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.WORD}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.NOTE}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.LEVEL}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.ACCURACY}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>
                  <Tooltip title="Delete">
                    <Fab size="small" color="secondary" onClick={() => this.deleteWord(row)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Fab size="small" color="primary" onClick={() => history.push('/words-lang-detail/' + row.ID)}>
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
                  <Tooltip title="Level Up">
                    <Fab size="small" onClick={() => this.updateLevel(row, 1)}>
                      <FontAwesomeIcon icon={faArrowUp} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Level Down">
                    <Fab size="small" onClick={() => this.updateLevel(row, -1)}>
                      <FontAwesomeIcon icon={faArrowDown} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Google Word" onClick={() => this.googleWord(row.WORD)}>
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faGoogle} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Dictionary" onClick={() => this.dictReference(row)}>
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
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
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

  onNewWordKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !this.state.newWord) return;
    const o = this.wordsLangService.newLangWord();
    o.WORD = this.settingsService.autoCorrectInput(this.state.newWord);
    this.setState({newWord: ''});
    this.updateServiceState();
    this.subscription.add(this.wordsLangService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsLangService.langWords.push(o);
    }));
  };

  handleChangePage = (event: any, page: any) => {
    this.setState({ page: page + 1 });
    this.onRefresh(page + 1, this.state.rows);
  };

  handleChangeRowsPerPage = (event: any) => {
    this.setState({ page: 1, rows: event.target.value });
    this.onRefresh(1, event.target.value);
  };

  onRefresh = (page: number, rows: number) => {
    this.subscription.add(this.wordsLangService.getData(page, rows).subscribe(_ => {
      this.updateServiceState();
    }));
  };

  deleteWord(item: MLangWord) {
    this.wordsLangService.delete(item);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsLangService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  updateLevel(item: MLangWord, delta: number) {
    const i = this.wordsLangService.langWords.indexOf(item);
    this.settingsService.updateLevel(item, item.ID, delta).subscribe();
  }

  dictReference(item: MLangWord) {
    const index = this.wordsLangService.langWords.indexOf(item);
    history.push('/words-dict/lang/' + index);
  }

  updateServiceState() {
    this.setState({wordsLangService: this.wordsLangService});
  }
};

