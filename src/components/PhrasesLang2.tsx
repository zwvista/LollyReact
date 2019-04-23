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
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faPlus, faSync, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { PhrasesLangService } from '../view-models/phrases-lang.service';
import { googleString } from '../common/common';

export default class PhrasesLang2 extends React.Component<any, any> {
  @Inject phrasesLangService: PhrasesLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
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
          <Button variant="contained" color="primary" onClick={() => history.push('/phrases-unit-detail/0')}>
            <span><FontAwesomeIcon icon={faPlus} />Add</span>
          </Button>
          <Button variant="contained" color="primary" onClick={(e: any) => this.onRefresh(this.state.page, this.state.rows)}>
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
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
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
                    <Fab size="small" color="secondary" onClick={() => this.deletePhrase(row.ID)}>
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
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }

  handleChangePage = (event: any, page: any) => {
    this.setState({ page: page + 1 });
    this.onRefresh(page + 1, this.state.rows);
  };

  handleChangeRowsPerPage = (event: any) => {
    this.setState({ page: 1, rows: event.target.value });
    this.onRefresh(1, event.target.value);
  };

  onRefresh = (page: number, rows: number) => {
    this.subscription.add(this.phrasesLangService.getData(page, rows).subscribe(
      _ => this.updateServiceState()
    ));
  };

  deletePhrase(id: number) {
    this.phrasesLangService.delete(id);
  }

  updateServiceState() {
    this.setState({phrasesLangService: this.phrasesLangService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

