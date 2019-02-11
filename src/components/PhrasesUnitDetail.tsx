import * as React from 'react';
import { PhrasesUnitService } from '../view-models/phrases-unit.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';

export default class PhrasesUnitDetail extends React.Component<any, any> {
  @Inject phrasesUnitService: PhrasesUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.phrasesUnitService.unitPhrases.find(value => value.ID === id);
    this.setState({
      unitPhrase: o ? {...o} : this.phrasesUnitService.newUnitPhrase(),
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
          <InputText id="ID" name="ID" value={this.state.unitPhrase.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
          <InputText id="UNIT" name="UNIT" value={this.state.unitPhrase.UNIT} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PART">PART:</label>
          <InputText id="PART" name="PART" value={this.state.unitPhrase.PART} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
          <InputText id="SEQNUM" name="SEQNUM" value={this.state.unitPhrase.SEQNUM} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASE">PHRASE:</label>
          <InputText id="PHRASE" name="PHRASE" value={this.state.unitPhrase.PHRASE} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TRANSLATION">TRANSLATION:</label>
          <InputText id="TRANSLATION" name="TRANSLATION" value={this.state.unitPhrase.TRANSLATION} onChange={this.onChange} />
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
    this.state.unitPhrase[elem.name] = elem.value;
    this.setState({unitPhrase: this.state.unitPhrase})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.unitPhrase.PHRASE = this.settingsService.autoCorrectInput(this.state.unitPhrase.PHRASE);
    if (this.state.unitPhrase.ID) {
      this.subscription.add(this.phrasesUnitService.update(this.state.unitPhrase).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.phrasesUnitService.create(this.state.unitPhrase).subscribe(_ => this.goBack()));
    }
  };

};

