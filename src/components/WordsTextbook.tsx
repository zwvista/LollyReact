import * as React from 'react';
import { WordsTextbookService } from '../view-models/words-textbook.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { interval, Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { KeyboardEvent, SyntheticEvent } from 'react';
import history from '../view-models/history';
import * as CopyToClipboard from 'react-copy-to-clipboard';
import { SettingsService } from '../view-models/settings.service';

export default class WordsTextbook extends React.Component<any, any> {
  @Inject wordsTextbookService: WordsTextbookService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    newWord: '',
  };

  componentDidMount() {
    this.subscription.add(this.wordsTextbookService.getData().subscribe(
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
              onClick={() => history.push('/words-textbook-detail/' + rowData.ID)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button label="Retrieve Note" onClick={() => this.getNote(rowData.ID)} />
      <Button label="Google Word" onClick={() => this.googleWord(rowData.WORD)} />
      <Button label="Dictionary" onClick={() => this.dictMean(rowData.ID)} />
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Refresh" icon="fa fa-refresh" />
            <Button label="Dictionary" onClick={() => history.push('/words-dict/textbook/0')} />
          </div>
        </Toolbar>
        <DataTable value={this.wordsTextbookService.textbookWords} selectionMode="single" autoLayout={true}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'80px'}} field="UNIT" header="UNIT" />
          <Column style={{width:'80px'}} field="PART" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column style={{width:'40%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  deleteWord(index: number) {
    console.log(index);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsTextbookService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  dictMean(ID: number) {
    const index = this.wordsTextbookService.textbookWords.findIndex(value => value.ID === ID);
    history.push('/words-dict/textbook/' + index);
  }

  updateServiceState() {
    this.setState({wordsTextbookService: this.wordsTextbookService});
  }
};

