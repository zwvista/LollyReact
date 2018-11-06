import * as React from 'react';
import { WordsLangService } from '../view-models/words-lang.service';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';
import { Inject, Module } from 'react.di';

export default class WordsLangDetail extends React.Component<any, any> {
  @Inject wordsLangService: WordsLangService;
  subscription = new Subscription();

  componentDidMount() {
    const id = +this.props.match.params.id;
    const o = this.wordsLangService.langWords.find(value => value.ID === id);
    this.setState({
      langWord: o ? {...o} : this.wordsLangService.newLangWord(),
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
          <InputText id="ID" name="ID" value={this.state.langWord.ID} disabled />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="WORD">WORD:</label>
          <InputText id="WORD" name="WORD" value={this.state.langWord.WORD} onChange={this.onChange} />
        </div>
        <div className="p-grid mb-2">
          <label className="p-col-1" htmlFor="LEVEL">LEVEL:</label>
          <InputText id="LEVEL" name="LEVEL" value={this.state.langWord.LEVEL} onChange={this.onChange} />
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
    this.state.langWord[elem.name] = elem.value;
    this.setState({langWord: this.state.langWord})
  };

  goBack = () => {
    history.back();
  };

  save = () => {
    if (this.state.langWord.ID) {
      this.subscription.add(this.wordsLangService.update(this.state.langWord).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.wordsLangService.create(this.state.langWord).subscribe(_ => this.goBack()));
    }
  };

};

