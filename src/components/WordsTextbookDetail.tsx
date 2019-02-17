import * as React from 'react';
import { WordsTextbookService } from '../view-models/words-textbook.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';
import { Dropdown } from 'primereact/dropdown';

export default class WordsTextbookDetail extends React.Component<any, any> {
  @Inject wordsTextbookService: WordsTextbookService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.wordsTextbookService.textbookWords.find(value => value.ID === id);
    this.setState({
      textbookWord: o ? {...o} : this.wordsTextbookService.newTextbookWord(),
      textbooks: this.settingsService.textbooks.map(v => ({label: v, value: Number(v)})),
      parts: this.settingsService.parts.map((v, i) => ({label: v, value: i + 1})),
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  
  render() {
    return this.state && (
      <div>
        <div className="p-grid mt-2 mb-2">
          <label className="p-col-1" htmlFor="ID">ID:</label>
          <InputText id="ID" name="ID" value={this.state.textbookWord.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
          <Dropdown className="p-col-2" options={this.state.textbooks} value={this.state.textbookWord.UNIT} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PART">PART:</label>
          <Dropdown className="p-col-2" options={this.state.parts} value={this.state.textbookWord.PART} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
          <InputText id="SEQNUM" name="SEQNUM" value={this.state.textbookWord.SEQNUM} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORD">WORD:</label>
          <InputText id="WORD" name="WORD" value={this.state.textbookWord.WORD} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="NOTE">NOTE:</label>
          <InputText id="NOTE" name="NOTE" value={this.state.textbookWord.NOTE} onChange={this.onChange} />
        </div>
        <div>
          <Button label="Back" onClick={this.goBack} />
          <Button label="Save" onClick={this.save} />
        </div>
      </div>
    );
  }
  
  onChange = (e: any) => {
    const elem = e.nativeEvent.target as HTMLInputElement;
    this.state.textbookWord[elem.name] = elem.value;
    this.setState({textbookWord: this.state.textbookWord})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.textbookWord.WORD = this.settingsService.autoCorrectInput(this.state.textbookWord.WORD);
    if (this.state.textbookWord.ID) {
      this.subscription.add(this.wordsTextbookService.update(this.state.textbookWord).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.wordsTextbookService.create(this.state.textbookWord).subscribe(_ => this.goBack()));
    }
  };

};

