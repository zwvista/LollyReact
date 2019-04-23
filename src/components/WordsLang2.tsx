import * as React from 'react';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { WordsLangService } from '../view-models/words-lang.service';

export default class WordsLang2 extends React.Component<any, any> {
  @Inject wordsLangService: WordsLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
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
              <TableCell>WORD</TableCell>
              <TableCell>NOTE</TableCell>
              <TableCell>LEVEL</TableCell>
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.wordsLangService.langWords.map(row => (
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
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
    this.subscription.add(this.wordsLangService.getData(page, this.state.rows).subscribe(_ => {
      this.updateServiceState();
    }));
  };

  updateServiceState() {
    this.setState({wordsLangService: this.wordsLangService});
  }
};

