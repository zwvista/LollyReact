import * as React from 'react';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import {resolve} from "inversify-react";
import { SettingsService } from '../../view-models/misc/settings.service';
import { PatternsService } from '../../view-models/wpp/patterns.service';

export default class PatternsDetail extends React.Component<any, any> {
  @resolve patternsService: PatternsService;
  @resolve settingsService: SettingsService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.patternsService.patterns.find(value => value.ID === id);
    this.setState({
      pattern: o ? {...o} : this.patternsService.newPattern(),
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
          <InputText className="p-col-3" id="ID" value={this.state.pattern.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="PATTERN">PATTERN:</label>
          <InputText className="p-col-3" id="PATTERN" value={this.state.pattern.PATTERN} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="NOTE">NOTE:</label>
          <InputText className="p-col-3" id="NOTE" value={this.state.pattern.NOTE} onChange={this.onChangeInput} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="TAGS">TAGS:</label>
          <InputText className="p-col-3" id="TAGS" value={this.state.pattern.TAGS} onChange={this.onChangeInput} />
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
    this.state.pattern[elem.id] = elem.value;
    this.setState({pattern: this.state.pattern})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    this.state.pattern.PHRASE = this.settingsService.autoCorrectInput(this.state.pattern.PHRASE);
    if (this.state.pattern.ID) {
      this.subscription.add(this.patternsService.update(this.state.pattern).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.patternsService.create(this.state.pattern).subscribe(_ => this.goBack()));
    }
  };

};

