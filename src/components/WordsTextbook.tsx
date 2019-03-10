import * as React from 'react';
import { WordsTextbookService } from '../view-models/words-textbook.service';
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
import { SettingsService } from '../view-models/settings.service';
import * as $ from "jquery";
import { MWordColor } from '../models/word-color';

export default class WordsTextbook extends React.Component<any, any> {
  @Inject wordsTextbookService: WordsTextbookService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  state = {
    first: 0,
    rows: this.settingsService.USROWSPERPAGE,
    page: 1,
    selectedRow: null as any,
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
    this.onRefresh(e.page + 1)
  };

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate = (rowData: any, column: any) => {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash"
              tooltip="Delete" tooltipOptions={{position: 'top'}} />
      <Button icon="fa fa-edit" tooltip="Edit" tooltipOptions={{position: 'top'}}
              onClick={() => history.push('/words-textbook-detail/' + rowData.ID)} />
      <Button icon="fa fa-volume-up" tooltipOptions={{position: 'top'}}
              tooltip="Speak" onClick={() => this.speak(rowData.WORD)} />
      <CopyToClipboard text={rowData.WORD}>
        <Button icon="fa fa-copy" tooltip="Copy" tooltipOptions={{position: 'top'}}/>
      </CopyToClipboard>
      <Button icon="fa fa-arrow-up" tooltipOptions={{position: 'top'}}
              tooltip="Level Up" onClick={() => this.updateLevel(rowData.ID, 1)} />
      <Button icon="fa fa-arrow-down" tooltipOptions={{position: 'top'}}
              tooltip="Level Down" onClick={() => this.updateLevel(rowData.ID, -1)} />
      <Button hidden={!this.settingsService.selectedDictNote} label="Retrieve Note" onClick={() => this.getNote(rowData.ID)} />
      <Button icon="fa fa-google" onClick={() => this.googleWord(rowData.WORD)}
              tooltip="Google Word" tooltipOptions={{position: 'top'}}/>
      <Button icon="fa fa-book" onClick={() => this.dictMean(rowData.ID)}
              tooltip="Dictionary" tooltipOptions={{position: 'top'}}/>
    </div>;
  };

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button label="Refresh" icon="fa fa-refresh" onClick={(e: any) => this.onRefresh(this.state.page)}/>
            <Button label="Dictionary" icon="fa fa-book" onClick={() => history.push('/words-dict/textbook/0')} />
          </div>
        </Toolbar>
        <Paginator first={this.state.first} rows={this.state.rows} onPageChange={this.onPageChange}
                   totalRecords={this.wordsTextbookService.textbookWordCount}
                   rowsPerPageOptions={this.settingsService.USROWSPERPAGEOPTIONS}/>
        <DataTable value={this.wordsTextbookService.textbookWords} selectionMode="single" autoLayout={true}
                   selection={this.state.selectedRow} onSelectionChange={this.onSelectionChange}>
          <Column style={{width:'80px'}} field="ID" header="ID" />
          <Column style={{width:'150px'}} field="TEXTBOOKNAME" header="TEXTBOOKNAME" />
          <Column style={{width:'80px'}} field="UNITSTR" header="UNIT" />
          <Column style={{width:'80px'}} field="PARTSTR" header="PART" />
          <Column style={{width:'80px'}} field="SEQNUM" header="SEQNUM" />
          <Column style={{width:'80px'}} field="WORDID" header="WORDID" />
          <Column field="WORD" header="WORD" />
          <Column field="NOTE" header="NOTE" />
          <Column style={{width:'80px'}} field="LEVEL" header="LEVEL" />
          <Column style={{width:'30%'}} body={this.actionTemplate} header="ACTIONS" />
        </DataTable>
      </div>
    );
  }

  // Here we have to use JQuery to set td styles based on row number,
  // as PrimeReact DataTable has no rowStyle attribute.
  setRowStyle(o: MWordColor, tr: any) {
    const c = o.colorStyle;
    if (c['background-color'])
      $(tr).css('background-color', c['background-color']).css('color', c['color']);
    else
      $(tr).css('background-color', '').css('color', '');
  }

  onRefresh = (page: number) => {
    // https://stackoverflow.com/questions/4228356/integer-division-with-remainder-in-javascript
    this.subscription.add(this.wordsTextbookService.getData(page, this.state.rows).subscribe(_ => {
      this.updateServiceState();
      const self = this;
      $("tr").each((i, tr) => {
        if (i === 0) return;
        this.setRowStyle(self.wordsTextbookService.textbookWords[i - 1], tr);
      });
    }));
  };

  onSelectionChange = (e: any) => {
    this.setState({selectedRow: e.data});
  };

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

  updateLevel(ID: number, delta: number) {
    const i = this.wordsTextbookService.textbookWords.findIndex(v => v.ID === ID);
    const o = this.wordsTextbookService.textbookWords[i];
    this.settingsService.updateLevel(o, o.WORDID, delta).subscribe(_ => this.setRowStyle(o, $('tr').eq(i + 1)));
  }

  speak(word: string) {
    this.settingsService.speech.speak({
      text: word,
      queue: false,
    });
  }

  dictMean(ID: number) {
    const index = this.wordsTextbookService.textbookWords.findIndex(value => value.ID === ID);
    history.push('/words-dict/textbook/' + index);
  }

  updateServiceState() {
    this.setState({wordsTextbookService: this.wordsTextbookService});
  }
};

