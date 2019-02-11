import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';

export default class WordsUnitDetail extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
    this.setState({
      unitWord: o ? {...o} : this.wordsUnitService.newUnitWord(),
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
          <InputText id="ID" name="ID" value={this.state.unitWord.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
          <InputText id="UNIT" name="UNIT" value={this.state.unitWord.UNIT} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PART">PART:</label>
          <InputText id="PART" name="PART" value={this.state.unitWord.PART} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
          <InputText id="SEQNUM" name="SEQNUM" value={this.state.unitWord.SEQNUM} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORD">WORD:</label>
          <InputText id="WORD" name="WORD" value={this.state.unitWord.WORD} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="NOTE">NOTE:</label>
          <InputText id="NOTE" name="NOTE" value={this.state.unitWord.NOTE} onChange={this.onChange} />
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
    this.state.unitWord[elem.name] = elem.value;
    this.setState({unitWord: this.state.unitWord})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.unitWord.WORD = this.settingsService.autoCorrectInput(this.state.unitWord.WORD);
    if (this.state.unitWord.ID) {
      this.subscription.add(this.wordsUnitService.update(this.state.unitWord).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.wordsUnitService.create(this.state.unitWord).subscribe(_ => this.goBack()));
    }
  };

};

