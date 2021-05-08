import * as React from 'react';
import { Inject } from 'react.di';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../../view-models/misc/settings.service';
import {
  Button,
  Fab, MenuItem, Select,
  Table,
  TableBody,
  TableCell, TableFooter,
  TableHead,
  TablePagination,
  TableRow, TextField,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEdit, faPlus, faSync, faTrash, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import history from '../../view-models/misc/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { googleString } from '../../common/common';
import { SyntheticEvent } from 'react';
import { KeyboardEvent } from 'react';
import { ChangeEvent } from 'react';
import { ReactNode } from 'react';
import { AppService } from '../../view-models/misc/app.service';
import { PatternsService } from '../../view-models/wpp/patterns.service';

export default class Patterns2 extends React.Component<any, any> {
  @Inject appService: AppService;
  @Inject patternsService: PatternsService;
  @Inject settingsService: SettingsService;
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
            {this.settingsService.patternFilterTypes.map(row =>
              <MenuItem value={row.value} key={row.value}>{row.label}</MenuItem>
            )}
          </Select>
          <TextField label="Filter" value={this.state.filter}
                     onChange={this.onFilterChange} onKeyPress={this.onFilterKeyPress}/>
          <Button variant="contained" color="primary" onClick={() => history.push('/patterns-detail/0')}>
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
                count={this.patternsService.patternCount}
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
              <TableCell>PATTERN</TableCell>
              <TableCell>NOTE</TableCell>
              <TableCell>TAGS</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.patternsService.patterns.map(row => (
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.PATTERN}</TableCell>
                <TableCell>{row.NOTE}</TableCell>
                <TableCell>{row.TAGS}</TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <Fab size="small" color="secondary" onClick={() => this.deletePattern(row.ID)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Fab size="small" color="primary" onClick={() => history.push('/patterns-detail/' + row.ID)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="Speak">
                    <Fab size="small" color="primary" hidden={!this.settingsService.selectedVoice}
                         onClick={() => this.settingsService.speak(row.PATTERN)}>
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
                  <Tooltip title="Google Word" onClick={() => this.googlePattern(row.PATTERN)}>
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
                count={this.patternsService.patternCount}
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
    this.setState({ page: this.state.page = page + 1 });
    this.onRefresh();
  };

  handleChangeRowsPerPage = (event: any) => {
    this.setState({ page: this.state.page = 1, rows: this.state.rows = event.target.value });
    this.onRefresh();
  };

  onRefresh = () => {
    this.subscription.add(this.patternsService.getData(this.state.page, this.state.rows, this.state.filter, this.state.filterType).subscribe(
      _ => this.updateServiceState()
    ));
  };

  onFilterChange = (e: SyntheticEvent) => {
    this.setState({filter: (e.nativeEvent.target as HTMLInputElement).value});
  };

  onFilterKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    this.onRefresh();
  };

  onFilterTypeChange = (e: ChangeEvent<HTMLSelectElement>, child: ReactNode) => {
    this.setState({filterType: this.state.filterType = Number(e.target.value)});
    this.onRefresh();
  };

  deletePattern(id: number) {
    this.patternsService.delete(id);
  }

  updateServiceState() {
    this.setState({patternsService: this.patternsService});
  }

  googlePattern(pattern: string) {
    googleString(pattern);
  }
};

