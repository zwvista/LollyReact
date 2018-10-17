import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';

export default class WordsUnit extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  subscription = new Subscription();

  componentDidMount() {
    this.subscription.add(this.wordsUnitService.getData().subscribe(
      _ => this.setState({wordsUnitService: this.wordsUnitService})
    ));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate(rowData: any, column: any) {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash" />
      <Button className="button-margin-right" icon="fa fa-edit"/>
    </div>;
  }

  render() {
    return (
      <div>
        <DataTable value={this.wordsUnitService.unitWords}
                   selectionMode="single" autoLayout={true}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column field="ID" header="ID" />
          <Column field="UNIT" header="UNIT" />
          <Column field="PART" header="PART" />
          <Column field="SEQNUM" header="SEQNUM" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }
};

