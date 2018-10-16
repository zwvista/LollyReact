import * as React from 'react';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';


export default class PhrasesUnit extends React.Component<any, any> {
  @Inject phrasesUnitService: PhrasesUnitService;

  state: any = {
    phrasesUnitService: null,
  };

  componentDidMount() {
    this.phrasesUnitService.getData().subscribe(
      _ => this.setState({phrasesUnitService: this.phrasesUnitService})
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
        <DataTable value={this.phrasesUnitService ? this.phrasesUnitService.unitPhrases : []}
                   selectionMode="single" autoLayout={true}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column field="ID" header="ID" />
          <Column field="UNIT" header="UNIT" />
          <Column field="PART" header="PART" />
          <Column field="SEQNUM" header="SEQNUM" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }
};

