import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import './Common.css'
import { interval, Subscription } from 'rxjs';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { KeyboardEvent, SyntheticEvent } from 'react';

export default class WordsUnit extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  subscription = new Subscription();

  state = {
    newWord: '',
  };

  componentDidMount() {
    this.subscription.add(this.wordsUnitService.getData().subscribe(
      _ => this.setState({wordsUnitService: this.wordsUnitService})
    ));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  actionTemplate(rowData: any, column: any) {
    return <div>
      <Button className="p-button-danger button-margin-right" icon="fa fa-trash" />
      <Button className="button-margin-right" icon="fa fa-edit"/>
      <Button className="button-margin-right" label="Retrieve Note"/>
      <Button className="button-margin-right" icon="fa fa-copy"/>
      <Button className="button-margin-right" label="Dictionary"/>
    </div>;
  }

  render() {
    return (
      <div>
        <Toolbar>
          <div className="p-toolbar-group-left">
            <Button className="button-margin-right" label="Add" icon="fa fa-plus" />
            <Button className="button-margin-right" label="Refresh" icon="fa fa-refresh" />
            <Button className="button-margin-right" label="Retrieve All Notes" />
            <Button className="button-margin-right" label="Retrieve Notes If Empty" />
          </div>
        </Toolbar>
        <span className="p-float-label">
          <InputText id="float-input" type="text" value={this.state.newWord}
                     onChange={this.handleNewWordChange} onKeyPress={this.handleNewWordKeyPress}/>
          <label htmlFor="float-input">New Word</label>
        </span>
        <DataTable value={this.wordsUnitService.unitWords}
                   selectionMode="single" autoLayout={true}>
          <Column rowReorder={true} style={{width: '3em'}} />
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

  handleNewWordChange = (e: SyntheticEvent) => {
    this.setState({newWord: (e.nativeEvent.target as HTMLInputElement).value});
  };

  handleNewWordKeyPress = (e: KeyboardEvent) => {
    if (e.key !== 'Enter' || !this.state.newWord) return;
    const o = this.wordsUnitService.newUnitWord();
    o.WORD = this.state.newWord;
    this.subscription.add(this.wordsUnitService.create(o).subscribe(id => {
      o.ID = id as number;
      this.wordsUnitService.unitWords.push(o);
      this.setState({wordsUnitService: this.wordsUnitService, newWord: ''});
    }));
  };

  private reindex() {
    this.wordsUnitService.reindex(index => {});
  }

  onWordReorder(from: number, to: number) {
    console.log(`${from},${to}`);
    this.wordsUnitService.unitWords.move(from, to);
    this.reindex();
  }

  deleteWord(index: number) {
    console.log(index);
  }

  getNote(index: number) {
    console.log(index);
    this.wordsUnitService.getNote(index).subscribe();
  }

  // https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
  googleWord(WORD: string) {
    window.open('https://www.google.com/search?q=' + encodeURIComponent(WORD), '_blank');
  }

  getNotes(ifEmpty: boolean) {
    let subscription: Subscription;
    // https://stackoverflow.com/questions/50200859/i-dont-get-rxjs-6-with-angular-6-with-interval-switchmap-and-map
    this.wordsUnitService.getNotes(ifEmpty, n => subscription = interval(n).subscribe(_ =>
      this.wordsUnitService.getNextNote(() => {}, () => {
        subscription.unsubscribe();
      })
    ));
  }
};

