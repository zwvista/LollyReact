import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

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
              <TableRow key={row.ID}>
                <TableCell>{row.ID}</TableCell>
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

  onRefresh = (e:any) => {
    this.subscription.add(this.wordsUnitService.getDataInTextbook().subscribe(_ => {
      this.updateServiceState();
    }));
  };

  updateServiceState() {
    this.setState({wordsUnitService: this.wordsUnitService});
  }
};

