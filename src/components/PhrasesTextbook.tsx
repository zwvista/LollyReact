import * as React from 'react';
import { PhrasesTextbookService } from '../view-models/phrases-textbook.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { PageState, Paginator } from 'primereact/paginator';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { googleString } from '../common/common';
import { SettingsService } from '../view-models/settings.service';

export default class PhrasesTextbook extends React.Component<any, any> {
  @Inject phrasesTextbookService: PhrasesTextbookService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    rows: this.settingsService.USROWSPERPAGE,
    first: 0,
  };

  componentDidMount() {
    this.subscription.add(this.phrasesTextbookService.getData(1, this.state.rows).subscribe(
      _ => this.updateServiceState()
    ));
  }

  onPageChange = (e: PageState) => {
    this.setState({
      first: e.first,
      rows: e.rows
    });
    this.subscription.add(this.phrasesTextbookService.getData(e.page + 1, e.rows).subscribe(
      _ => this.updateServiceState()
    ));
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/phrases-textbook-detail/' + rowData.ID)}/>
      <CopyToClipboard text={rowData.PHRASE}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button label="Google Phrase" onClick={() => this.googlePhrase(rowData.PHRASE)} />
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Refresh" icon="fa fa-refresh" />
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesTextbookService.textbookPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.phrasesTextbookService.textbookPhrases} selectionMode="single" autoLayout={true}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  updateServiceState() {
    this.setState({phrasesTextbookService: this.phrasesTextbookService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

