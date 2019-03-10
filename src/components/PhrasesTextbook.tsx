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
import { MUnitPhrase } from '../models/unit-phrase';

export default class PhrasesTextbook extends React.Component<any, any> {
  @Inject phrasesTextbookService: PhrasesTextbookService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: this.settingsService.USROWSPERPAGE,
    page: 1,
    selectedRow: null as MUnitPhrase,
  };

  componentDidMount() {
    this.onRefresh(this.state.page);
  }

  onPageChange = (e: PageState) => {
    this.setState({
      first: e.first,
      rows: e.rows,
      page: e.page + 1,
    });
    this.onRefresh(e.page + 1);
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
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.settingsService.speak(rowData.PHRASE)} />
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
            <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh(this.state.page)}/>
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesTextbookService.textbookPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.phrasesTextbookService.textbookPhrases} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'150px'}} field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="PHRASEID" header="PHRASEID" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesTextbookService.textbookPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
      </div>
    );
  }

  onRefresh = (page: number) => {
    this.subscription.add(this.phrasesTextbookService.getData(page, this.state.rows).subscribe(
      _ => this.updateServiceState()
    ));
  };

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

  updateServiceState() {
    this.setState({phrasesTextbookService: this.phrasesTextbookService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }
};

