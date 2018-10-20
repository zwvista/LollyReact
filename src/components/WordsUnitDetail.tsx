import * as React from 'react';
import { WordsUnitService } from '../view-models/words-unit.service';
import { Inject } from 'react.di';
import { Button } from 'primereact/button';
import './Common.css'
import { Subscription } from 'rxjs';
import { InputText } from 'primereact/inputtext';

export default class WordsUnit extends React.Component<any, any> {
  @Inject wordsUnitService: WordsUnitService;
  subscription = new Subscription();

  constructor(props: {}) {
    super(props);
    const id = +this.props.match.params.id;
    const o = this.wordsUnitService.unitWords.find(value => value.ID === id);
    this.state = {
      unitWord: o ? {...o} : this.wordsUnitService.newUnitWord(),
    };
  }

  componentDidMount() {
    this.subscription.add(this.wordsUnitService.getData().subscribe(
      _ => this.setState({wordsUnitService: this.wordsUnitService})
    ));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }
  
  render() {
    return (
      <div>
        <div className="ui-inputgroup">
          <label className="ui-g-1" htmlFor="id">ID:</label>
          <InputText id="id" type="text" value={this.state.unitWord.ID} disabled />
        </div>
        <div className="ui-inputgroup">
          <label className="ui-g-1" htmlFor="unit">UNIT:</label>
          <InputText id="unit" type="text" value={this.state.unitWord.UNIT} />
        </div>
        <div className="ui-inputgroup">
          <label className="ui-g-1" htmlFor="part">PART:</label>
          <InputText id="part" type="text" value={this.state.unitWord.PART} />
        </div>
        <div className="ui-inputgroup">
          <label className="ui-g-1" htmlFor="seqnum">SEQNUM:</label>
          <InputText id="seqnum" type="text" value={this.state.unitWord.SEQNUM} />
        </div>
        <div className="ui-inputgroup">
          <label className="ui-g-1" htmlFor="word">WORD:</label>
          <InputText id="word" type="text" value={this.state.unitWord.WORD} />
        </div>
        <div className="ui-inputgroup">
          <label className="ui-g-1" htmlFor="note">NOTE:</label>
          <InputText id="note" type="text" value={this.state.unitWord.NOTE} />
        </div>
        <div>
          <Button label="Back" onClick={this.goBack} />
          <Button label="Save" onClick={this.save} />
        </div>
      </div>
    );
  }

  goBack = () => {
    history.back();
  };

  save = () => {
    if (this.state.unitWord.ID) {
      this.subscription.add(this.wordsUnitService.update(this.state.unitWord).subscribe(_ => this.goBack()));
    } else {
      this.subscription.add(this.wordsUnitService.create(this.state.unitWord).subscribe(_ => this.goBack()));
    }
  };

};

