import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';


export default class WordsUnit extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;

  state: any = {
    wordsUnitService: null,
  };

  componentDidMount() {
    this.wordsUnitService.getData().subscribe(
      _ => this.setState({wordsUnitService: this.wordsUnitService})
    );
  }

  actionTemplate(rowData: any, column: any) {
    return <div>
      <Button label="Delete" className="p-button-danger"/>
      <Button label="Edit" />
    </div>;
  }

  render() {
    return (
      <div>
        <DataTable value={this.state.wordsUnitService ? this.state.wordsUnitService.unitWords : []}
                   selectionMode="single" autoLayout={true}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column field="ID" header="ID" />
          <Column field="UNIT" header="UNIT" />
          <Column field="PART" header="PART" />
          <Column field="SEQNUM" header="SEQNUM" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column body={this.actionTemplate} />
        </DataTable>
      </div>
    );
  }
};

