import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import {
  Button,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import {
  faTrash,
  faEdit,
  faVolumeUp,
  faCopy,
  faArrowUp,
  faArrowDown,
  faBook,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MUnitWord } from '../models/unit-word';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';

export default class WordsUnit2 extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
  };

  componentDidMount() {
    this.onRefresh(null);
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
          <Button variant="contained" color="primary" onClick={() => history.push('/words-unit-detail/0')}>
            <span><FontAwesomeIcon icon={faPlus} />Add</span>
          </Button>
          <Button variant="contained" color="primary" onClick={this.onRefresh}>
            <span><FontAwesomeIcon icon={faPlus} />Refresh</span>
          </Button>
          <Button hidden={!this.settingsService.selectedDictNote} variant="contained">
            Retrieve All Notes
          </Button>
          <Button hidden={!this.settingsService.selectedDictNote} variant="contained">
            Retrieve Notes If Empty
          </Button>
          <Button variant="contained" color="primary" onClick={() => history.push('/words-dict/unit/0')}>
            <span><FontAwesomeIcon icon={faBook} />Dictionary</span>
          </Button>
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>UNIT</TableCell>
              <TableCell>PART</TableCell>
              <TableCell>SEQNUM</TableCell>
              <TableCell>WORDID</TableCell>
              <TableCell>WORD</TableCell>
              <TableCell>NOTE</TableCell>
              <TableCell>LEVEL</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.wordsUnitService.unitWords.map(row => (
              <TableRow key={row.ID} style={{backgroundColor:row.colorStyle['background-color']}}>
                <TableCell style={{color:row.colorStyle['color']}}>{row.ID}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.UNITSTR}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.PARTSTR}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.SEQNUM}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.WORDID}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.WORD}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.NOTE}</TableCell>
                <TableCell style={{color:row.colorStyle['color']}}>{row.LEVEL}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <Fab size="small" color="secondary" onClick={() => this.deleteWord(row)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Fab size="small" color="primary" onClick={() => history.push('/words-unit-detail/' + row.ID)}>
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
                    <Fab size="small" onClick={() => this.updateLevel(row.ID, 1)}>
                      <FontAwesomeIcon icon={faArrowUp} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Level Down">
                    <Fab size="small" onClick={() => this.updateLevel(row.ID, -1)}>
                      <FontAwesomeIcon icon={faArrowDown} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Google Word" onClick={() => this.googleWord(row.WORD)}>
                    <Fab size="small" color="primary">
                      <FontAwesomeIcon icon={faGoogle} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Dictionary" onClick={() => this.dictReference(row.ID)}>
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
        </Table>
      </div>
    );
  }

  onNewWordChange = (e: SyntheticEvent) => {
    this.setState({newWord: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onNewWordKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !this.state.newWord) return;
    const o = this.wordsUnitService.newUnitWord();
    o.WORD = this.settingsService.autoCorrectInput(this.state.newWord);
    this.setState({newWord: ''});
    this.updateServiceState();
    this.subscription.add(this.wordsUnitService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsUnitService.unitWords.push(o);
      this.updateServiceState();
    }));
  };

  onRefresh = (e:any) => {
    this.subscription.add(this.wordsUnitService.getDataInTextbook().subscribe(_ => {
      this.updateServiceState();
    }));
  };

  deleteWord(item: MUnitWord) {
    this.wordsUnitService.delete(item);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsUnitService.getNote(index).subscribe();
  }

  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  updateLevel(ID: number, delta: number) {
    const i = this.wordsUnitService.unitWords.findIndex(v => v.ID === ID);
    const o = this.wordsUnitService.unitWords[i];
    this.settingsService.updateLevel(o, o.WORDID, delta).subscribe();
  }

  dictReference(ID: number) {
    const index = this.wordsUnitService.unitWords.findIndex(value => value.ID === ID);
    history.push('/words-dict/unit/' + index);
  }

  getNotes(ifEmpty: boolean) {
    this.wordsUnitService.getNotes(ifEmpty, () => {}, () => {});
  }

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

