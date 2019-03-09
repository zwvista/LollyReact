import * as React from 'react';
import { PhrasesLangService } from '../view-models/phrases-lang.service';
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

export default class PhrasesLang extends React.Component<any, any> {
  @Inject phrasesLangService: PhrasesLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    rows: this.settingsService.USROWSPERPAGE,
    first: 0,
  };

  componentDidMount() {
    this.onRefresh(null);
  }

  onPageChange = (e: PageState) => {
    this.setState({
      first: e.first,
      rows: e.rows
    });
    this.subscription.add(this.phrasesLangService.getData(e.page + 1, e.rows).subscribe(
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
              onClick={() => history.push('/phrases-lang-detail/' + rowData.ID)}/>
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.speak(rowData.PHRASE)} />
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
            <Button label="Add" icon="fa fa-plus" onClick={() => history.push('/phrases-lang-detail/0')} />
            <Button label="Refresh" icon="fa fa-refresh" onClick={this.onRefresh}/>
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.phrasesLangService.langPhraseCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.phrasesLangService.langPhrases} selectionMode="single" autoLayout={true}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column field="PHRASE" header="PHRASE" />
          <Column field="TRANSLATION" header="TRANSLATION" />
          <Column style={{width:'20%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  onRefresh = (e:any) => {
    this.subscription.add(this.phrasesLangService.getData(1, this.state.rows).subscribe(
      _ => this.updateServiceState()
    ));
  };

  updateServiceState() {
    this.setState({phrasesLangService: this.phrasesLangService});
  }

  googlePhrase(phrase: string) {
    googleString(phrase);
  }

  speak(phrase: string) {
    this.settingsService.speech.speak({
      text: phrase,
      queue: false,
    });
  }
};

