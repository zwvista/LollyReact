import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import './Common.css'
import { Subscription } from 'rxjs';
import { SettingsService } from '../view-models/settings.service';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';

export default class PhrasesTextbook2 extends React.Component<any, any> {
  @Inject phrasesUnitService: PhrasesUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
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
                <TableCell>A</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  onRefresh = (e:any) => {
    this.subscription.add(this.phrasesUnitService.getDataInTextbook().subscribe(
      _ => this.updateServiceState()
    ));
  };

  updateServiceState() {
    this.setState({phrasesUnitService: this.phrasesUnitService});
  }
};

