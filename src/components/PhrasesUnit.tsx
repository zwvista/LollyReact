import * as React from 'react';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import history from '../view-models/history';


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
      <Button className="button-margin-right" icon="fa fa-edit" onClick={e => history.push('/phrases-unit-detail/' + rowData.ID)}/>
    </div>;
  }

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button className="button-margin-right" label="Add" icon="fa fa-plus" onClick={e => history.push('/phrases-unit-detail/0')} />
            <Button className="button-margin-right" label="Refresh" icon="fa fa-refresh" />
          </div>
        </Toolbar>
        <DataTable value={this.phrasesUnitService.unitPhrases}
                   selectionMode="single" autoLayout={true}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNIT" header="UNIT" />
          <Column style={{width:'80px'}} field="PART" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'10%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }
};

