import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';
import { Dropdown } from 'primereact/dropdown';

export default class WordsUnitDetail extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
    this.setState({
      item: o ? {...o} : this.wordsUnitService.newUnitWord(),
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
          <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
          <Dropdown className="p-col-3" autoWidth={false} options={this.settingsService.units} value={this.state.item.UNIT} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PART">PART:</label>
          <Dropdown className="p-col-3" autoWidth={false} options={this.settingsService.parts} value={this.state.item.PART} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
          <InputText className="p-col-3" id="SEQNUM" name="SEQNUM" value={this.state.item.SEQNUM} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORDID">WORDID:</label>
          <InputText className="p-col-3" id="WORDID" name="WORDID" value={this.state.item.WORDID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORD">WORD:</label>
          <InputText className="p-col-3" id="WORD" name="WORD" value={this.state.item.WORD} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="NOTE">NOTE:</label>
          <InputText className="p-col-3" id="NOTE" name="NOTE" value={this.state.item.NOTE} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="FAMIID">FAMIID:</label>
          <InputText className="p-col-3" id="FAMIID" name="FAMIID" value={this.state.item.FAMIID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="LEVEL">LEVEL:</label>
          <InputText className="p-col-3" id="LEVEL" name="NOTE" value={this.state.item.LEVEL} onChange={this.onChange} />
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
    this.state.item.WORD = this.settingsService.autoCorrectInput(this.state.item.WORD);
    if (this.state.item.ID) {
      this.subscription.add(this.wordsUnitService.update(this.state.item).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.wordsUnitService.create(this.state.item).subscribe(_ => this.goBack()));
    }
  };

};

