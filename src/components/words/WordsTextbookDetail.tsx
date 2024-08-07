import * as React from 'react';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dropdown } from 'primereact/dropdown';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';

export default class WordsTextbookDetail extends React.Component<any, any> {
  wordsUnitService = container.resolve(WordsUnitService);
  settingsService = container.resolve(SettingsService);

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.wordsUnitService.textbookWords.find(value => value.ID === id);
    this.setState({
      item: o,
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
          <label className="p-col-1" htmlFor="TEXTBOOK">TEXTBOOK:</label>
          <InputText className="p-col-3" id="TEXTBOOK" value={this.state.item.TEXTBOOKNAME} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
          <Dropdown className="p-col-3" id="UNIT" options={this.settingsService.units} value={this.state.item.UNIT} onChange={this.onChangeDropDown} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PART">PART:</label>
          <Dropdown className="p-col-3" id="PART" options={this.settingsService.parts} value={this.state.item.PART} onChange={this.onChangeDropDown} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
          <InputText className="p-col-3" id="SEQNUM" value={this.state.item.SEQNUM} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORDID">WORDID:</label>
          <InputText className="p-col-3" id="WORDID" value={this.state.item.WORDID} disabled />
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

  onChangeDropDown = (e: any) => {
    this.state.item[e.target.id] = e.value;
    this.setState({item: this.state.item})
  };

  goBack = () => {
    history.back();
  };

  save = async () => {
    this.state.item.WORD = this.settingsService.autoCorrectInput(this.state.item.WORD);
    await this.wordsUnitService.update(this.state.item);
    this.goBack();
  };

};

