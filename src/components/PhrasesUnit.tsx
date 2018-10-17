import * as React from 'react';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';


export default class PhrasesUnit extends React.Component<any, any> {
  @Inject phrasesUnitService: PhrasesUnitService;
  subscription = new Subscription();

  componentDidMount() {
    this.subscription.add(this.phrasesUnitService.getData().subscribe(
      _ => this.setState({phrasesUnitService: this.phrasesUnitService})
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
        <DataTable value={this.phrasesUnitService.unitPhrases}
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

