import * as React from 'react';
import { PhrasesLangService } from '../../view-models/wpp/phrases-lang.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';

export default class PhrasesLangDetail extends React.Component<any, any> {
  phrasesLangService = container.resolve(PhrasesLangService);
  settingsService = container.resolve(SettingsService);

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.phrasesLangService.langPhrases.find(value => value.ID === id);
    this.setState({
      langPhrase: o ? {...o} : this.phrasesLangService.newLangPhrase(),
    });
  }

  render() {
    return this.state && (
      <div>
        <div className="p-grid mt-2 mb-2">
          <label className="p-col-1" htmlFor="ID">ID:</label>
          <InputText className="p-col-3" id="ID" value={this.state.langPhrase.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASE">PHRASE:</label>
          <InputText className="p-col-3" id="PHRASE" value={this.state.langPhrase.PHRASE} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TRANSLATION">TRANSLATION:</label>
          <InputText className="p-col-3" id="TRANSLATION" value={this.state.langPhrase.TRANSLATION} onChange={this.onChangeInput} />
        </div>
        <div>
          <Button label="Back" onClick={this.goBack} />
          <Button label="Save" onClick={this.save} />
        </div>
      </div>
    );
  }

  onChangeInput = (e: any) => {
    const elem = e.nativeEvent.target as HTMLInputElement;
    this.state.langPhrase[elem.id] = elem.value;
    this.setState({langPhrase: this.state.langPhrase})
  };

  goBack = () => {
    history.back();
  };

  save = async () => {
    this.state.langPhrase.PHRASE = this.settingsService.autoCorrectInput(this.state.langPhrase.PHRASE);
    if (this.state.langPhrase.ID)
      await this.phrasesLangService.update(this.state.langPhrase);
    else
      await this.phrasesLangService.create(this.state.langPhrase);
    this.goBack();
  };

};

