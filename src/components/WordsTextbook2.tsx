import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

export default class WordsTextbook2 extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: this.settingsService.USROWSPERPAGE,
    page: 1,
  };

  componentDidMount() {
    this.onRefresh(this.state.page);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>TEXTBOOKNAME</TableCell>
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
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
                <TableCell>{row.TEXTBOOKNAME}</TableCell>
                <TableCell>{row.UNITSTR}</TableCell>
                <TableCell>{row.PARTSTR}</TableCell>
                <TableCell>{row.SEQNUM}</TableCell>
                <TableCell>{row.WORDID}</TableCell>
                <TableCell>{row.WORD}</TableCell>
                <TableCell>{row.NOTE}</TableCell>
                <TableCell>{row.LEVEL}</TableCell>
                <TableCell>A</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  onRefresh = (page: number) => {
    this.subscription.add(this.wordsUnitService.getDataInLang(page, this.state.rows).subscribe(_ => {
      this.updateServiceState();
    }));
  };

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

