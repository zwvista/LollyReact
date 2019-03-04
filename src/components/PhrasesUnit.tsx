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
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { googleString } from '../common/common';

export default class PhrasesUnit extends React.Component<any, any> {
  @Inject phrasesUnitService: PhrasesUnitService;
  subscription = new Subscription();

  componentDidMount() {
    this.subscription.add(this.phrasesUnitService.getData().subscribe(
      _ => this.updateServiceState()
    ));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/phrases-unit-detail/' + rowData.ID)}/>
      <CopyToClipboard text={rowData.PHRASE}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-google" onClick={() => this.googlePhrase(rowData.PHRASE)}
              tooltip="Google Phrase" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/phrases-unit-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" />
          </div>
        </Toolbar>
        <DataTable value={this.phrasesUnitService.unitPhrases} selectionMode="single" autoLayout={true}
                   onRowReorder={this.onReorder}>
          <Column rowReorder={true} style={{width: '3em'}} />
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="PHRASEID" header="PHRASEID" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  onReorder = (e:any) => {
    console.log(`${e.dragIndex},${e.dropIndex}`);
    this.phrasesUnitService.unitPhrases = e.value;
    this.phrasesUnitService.reindex(index => this.updateServiceState());
  };

  updateServiceState() {
    this.setState({phrasesUnitService: this.phrasesUnitService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

