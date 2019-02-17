import * as React from 'react';
import { PhrasesTextbookService } from '../view-models/phrases-textbook.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';
import { Dropdown } from 'primereact/dropdown';

export default class PhrasesTextbookDetail extends React.Component<any, any> {
  @Inject phrasesTextbookService: PhrasesTextbookService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.phrasesTextbookService.textbookPhrases.find(value => value.ID === id);
    this.setState({
      textbookPhrase: o ? {...o} : this.phrasesTextbookService.newTextbookPhrase(),
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
          <InputText id="ID" name="ID" value={this.state.textbookPhrase.ID} disabled />
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
          <InputText id="SEQNUM" name="SEQNUM" value={this.state.textbookPhrase.SEQNUM} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASE">PHRASE:</label>
          <InputText id="PHRASE" name="PHRASE" value={this.state.textbookPhrase.PHRASE} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TRANSLATION">TRANSLATION:</label>
          <InputText id="TRANSLATION" name="TRANSLATION" value={this.state.textbookPhrase.TRANSLATION} onChange={this.onChange} />
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
    this.state.textbookPhrase[elem.name] = elem.value;
    this.setState({textbookPhrase: this.state.textbookPhrase})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.textbookPhrase.PHRASE = this.settingsService.autoCorrectInput(this.state.textbookPhrase.PHRASE);
    if (this.state.textbookPhrase.ID) {
      this.subscription.add(this.phrasesTextbookService.update(this.state.textbookPhrase).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.phrasesTextbookService.create(this.state.textbookPhrase).subscribe(_ => this.goBack()));
    }
  };

};

