import * as React from 'react';
import { PhrasesLangService } from '../view-models/phrases-lang.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';

export default class PhrasesLangDetail extends React.Component<any, any> {
  @Inject phrasesLangService: PhrasesLangService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.phrasesLangService.langPhrases.find(value => value.ID === id);
    this.setState({
      langPhrase: o ? {...o} : this.phrasesLangService.newLangPhrase(),
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
          <InputText className="p-col-3" id="ID" name="ID" value={this.state.langPhrase.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASE">PHRASE:</label>
          <InputText className="p-col-3" id="PHRASE" name="PHRASE" value={this.state.langPhrase.PHRASE} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TRANSLATION">TRANSLATION:</label>
          <InputText className="p-col-3" id="TRANSLATION" name="TRANSLATION" value={this.state.langPhrase.TRANSLATION} onChange={this.onChange} />
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
    this.state.langPhrase[elem.name] = elem.value;
    this.setState({langPhrase: this.state.langPhrase})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.langPhrase.PHRASE = this.settingsService.autoCorrectInput(this.state.langPhrase.PHRASE);
    if (this.state.langPhrase.ID) {
      this.subscription.add(this.phrasesLangService.update(this.state.langPhrase).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.phrasesLangService.create(this.state.langPhrase).subscribe(_ => this.goBack()));
    }
  };

};

