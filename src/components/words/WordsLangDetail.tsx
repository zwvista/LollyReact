import * as React from 'react';
import { WordsLangService } from '../../view-models/wpp/words-lang.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { resolve } from "inversify-react";
import { SettingsService } from '../../view-models/misc/settings.service';

export default class WordsLangDetail extends React.Component<any, any> {
  @resolve wordsLangService: WordsLangService;
  @resolve settingsService: SettingsService;

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.wordsLangService.langWords.find(value => value.ID === id);
    this.setState({
      item: o || this.wordsLangService.newLangWord(),
    });
  }

  render() {
    return this.state && (
      <div>
        <div className="p-grid mt-2 mb-2">
          <label className="p-col-1" htmlFor="ID">ID:</label>
          <InputText className="p-col-3" id="ID" value={this.state.item.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORD">WORD:</label>
          <InputText className="p-col-3" id="WORD" value={this.state.item.WORD} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="NOTE">NOTE:</label>
          <InputText className="p-col-3" id="NOTE" value={this.state.item.NOTE} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="FAMIID">FAMIID:</label>
          <InputText className="p-col-3" id="FAMIID" value={this.state.item.FAMIID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="ACCURACY">ACCURACY:</label>
          <InputText className="p-col-3" id="ACCURACY" value={this.state.item.ACCURACY} disabled />
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
    this.state.item[elem.id] = elem.value;
    this.setState({item: this.state.item})
  };

  goBack = () => {
    history.back();
  };

  save = async () => {
    this.state.item.WORD = this.settingsService.autoCorrectInput(this.state.item.WORD);
    if (this.state.item.ID)
      await this.wordsLangService.update(this.state.item);
    else
      await this.wordsLangService.create(this.state.item);
    this.goBack();
  };

};

