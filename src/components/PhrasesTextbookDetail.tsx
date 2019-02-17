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
      item: o,
      units: this.settingsService.units.map(v => ({label: v, value: Number(v)})),
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
          <InputText className="p-col-3" id="ID" name="ID" value={this.state.item.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TEXTBOOK">TEXTBOOK:</label>
          <InputText className="p-col-3" id="TEXTBOOK" name="TEXTBOOK" value={this.state.item.TEXTBOOKNAME} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
          <Dropdown className="p-col-3" autoWidth={false} options={this.state.units} value={this.state.item.UNIT} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PART">PART:</label>
          <Dropdown className="p-col-3" autoWidth={false} options={this.state.parts} value={this.state.item.PART} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
          <InputText className="p-col-3" id="SEQNUM" name="SEQNUM" value={this.state.item.SEQNUM} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASEID">PHRASEID:</label>
          <InputText className="p-col-3" id="PHRASEID" name="PHRASEID" value={this.state.item.PHRASEID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASE">PHRASE:</label>
          <InputText className="p-col-3" id="PHRASE" name="PHRASE" value={this.state.item.PHRASE} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TRANSLATION">TRANSLATION:</label>
          <InputText className="p-col-3" id="TRANSLATION" name="TRANSLATION" value={this.state.item.TRANSLATION} onChange={this.onChange} />
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
    this.state.item[elem.name] = elem.value;
    this.setState({item: this.state.item})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.item.PHRASE = this.settingsService.autoCorrectInput(this.state.item.PHRASE);
  };

};

