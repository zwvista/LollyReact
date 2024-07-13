import * as React from 'react';
import { PhrasesUnitService } from '../../view-models/wpp/phrases-unit.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dropdown } from 'primereact/dropdown';

export default class PhrasesUnitDetail extends React.Component<any, any> {
  phrasesUnitService = container.resolve(PhrasesUnitService);
  settingsService = container.resolve(SettingsService);

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.phrasesUnitService.unitPhrases.find(value => value.ID === id);
    this.setState({
      item: o ? {...o} : this.phrasesUnitService.newUnitPhrase(),
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
          <label className="p-col-1" htmlFor="PHRASEID">PHRASEID:</label>
          <InputText className="p-col-3" id="PHRASEID" value={this.state.item.PHRASEID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PHRASE">PHRASE:</label>
          <InputText className="p-col-3" id="PHRASE" value={this.state.item.PHRASE} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TRANSLATION">TRANSLATION:</label>
          <InputText className="p-col-3" id="TRANSLATION" value={this.state.item.TRANSLATION} onChange={this.onChangeInput} />
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
    this.state.item.PHRASE = this.settingsService.autoCorrectInput(this.state.item.PHRASE);
    if (this.state.item.ID)
      await this.phrasesUnitService.update(this.state.item);
    else
      await this.phrasesUnitService.create(this.state.item);
    this.goBack();
  };

};

