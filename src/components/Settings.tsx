import * as React from 'react';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';
import './Common.css'
import { Subscription } from 'rxjs';

export default class Settings extends React.Component<any, any> {
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  get toTypeIsUnit() {
    return this.state.toType === 0;
  }
  get toTypeIsPart() {
    return this.state.toType === 1;
  }
  get toTypeIsTo() {
    return this.state.toType === 2;
  }

  state = {
    toTypes: ['Unit', 'Part', 'To'].map((v, i) => ({value: i, label: v})),
    toType: 0,
  };

  componentDidMount() {
    this.subscription.add(this.settingsService.getData().subscribe(_ => this.updateTextbook()));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return this.settingsService.selectedLang ? (
      <div className="container mt-2">
        <div className="form-inline mb-2">
          <label htmlFor="lang" className="col-2 control-label">Languages:</label>
          <select id="lang" className="col-4 form-control" value={this.settingsService.selectedLang.ID} onChange={this.onLangChange}>
          {
            this.settingsService.languages.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="voice" className="col-2 control-label">Voice:</label>
          <select id="voice" className="col-4 form-control" value={this.settingsService.selectedVoice ? this.settingsService.selectedVoice.ID : ''} onChange={this.onVoiceChange}>
            {
              this.settingsService.voices.map(o => <option key={o.ID} value={o.ID}>{o.VOICENAME}</option>)
            }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="dictItem" className="col-2 control-label">Dictionary(Word):</label>
          <select id="dictItem" className="col-4 form-control" value={this.settingsService.selectedDictItem.DICTID} onChange={this.onDictItemChange}>
          {
            this.settingsService.dictItems.map(o => <option key={o.DICTID} value={o.DICTID}>{o.DICTNAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="dictNote" className="col-2 control-label">Dictionary(Note):</label>
          <select id="dictNote" className="col-4 form-control" value={this.settingsService.selectedDictNote ? this.settingsService.selectedDictNote.ID : ''} onChange={this.onDictNoteChange}>
          {
            this.settingsService.dictsNote.map(o => <option key={o.ID} value={o.ID}>{o.DICTNAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="textbook" className="col-2 control-label">Textbook:</label>
          <select id="textbook" className="col-4 form-control" value={this.settingsService.selectedTextbook.ID} onChange={this.onTextbookChange}>
          {
            this.settingsService.textbooks.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="unitFrom" className="col-2 control-label">Unit:</label>
          <select id="unitFrom" className="col-2 form-control" value={this.settingsService.USUNITFROM} onChange={this.onUnitFromChange}>
          {
            this.settingsService.units.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
          </select>
          <select id="partFrom" className="col-2 form-control" disabled={this.toTypeIsUnit} value={this.settingsService.USPARTFROM} onChange={this.onPartFromChange}>
          {
            this.settingsService.parts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <select id="toType" className="col-1 form-control" value={this.state.toType} onChange={this.onToTypeChange}>
            {
              this.state.toTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
            }
          </select>
          <label className="col-1 control-label" />
          <select id="unitTo" className="col-2 form-control" disabled={!this.toTypeIsTo} value={this.settingsService.USUNITTO} onChange={this.onUnitToChange}>
          {
            this.settingsService.units.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
          </select>
          <select id="partTo" className="col-2 form-control" disabled={!this.toTypeIsTo} value={this.settingsService.USPARTTO} onChange={this.onPartToChange}>
            {
              this.settingsService.parts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
            }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label className="col-2 control-label" />
          <button className="btn btn-primary mr-2" disabled={this.toTypeIsTo} onClick={this.previousUnitPart}>Previous</button>
          <button className="btn btn-primary mr-2" disabled={this.toTypeIsTo} onClick={this.nextUnitPart}>Next</button>
        </div>
      </div>
    ) : (<div/>);
  }

  onLangChange = (event: any) => {
    console.log(event);
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.setSelectedLang(this.settingsService.languages[index]).subscribe(_ => this.updateServiceState()));
    this.settingsService.updateLang().subscribe();
  };

  onVoiceChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedVoice = this.settingsService.voices[index];
    this.subscription.add(this.settingsService.updateVoice().subscribe(_ => this.updateServiceState()));
  };

  onDictItemChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictItem = this.settingsService.dictItems[index];
    this.subscription.add(this.settingsService.updateDictItem().subscribe(_ => this.updateServiceState()));
  };

  onDictNoteChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictNote = this.settingsService.dictsNote[index];
    this.subscription.add(this.settingsService.updateDictNote().subscribe(_ => this.updateServiceState()));
  };

  onTextbookChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedTextbook = this.settingsService.textbooks[index];
    this.subscription.add(this.settingsService.updateTextbook().subscribe(_ => this.updateServiceState()));
    this.updateTextbook();
  };

  onUnitFromChange = (event: any) => {
    const index = event.target.selectedIndex;
    if (!this.updateUnitFrom(this.settingsService.units[index].value, false)) return;
    if (this.state.toType === 0)
      this.updateSingleUnit();
    else if (this.state.toType === 1 || this.settingsService.isInvalidUnitPart)
      this.updateUnitPartTo();
  };

  onPartFromChange = (event: any) => {
    const index = event.target.selectedIndex;
    if (!this.updatePartFrom(this.settingsService.parts[index].value, false)) return;
    if (this.state.toType === 1 || this.settingsService.isInvalidUnitPart)
      this.updateUnitPartTo();
  };

  onToTypeChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.setState({toType: index});
    if (index === 0)
      this.updateSingleUnit();
    else if (index === 1)
      this.updateUnitPartTo();
  };

  previousUnitPart = (event: any) => {
    if (this.state.toType === 0) {
      if (this.settingsService.USUNITFROM > 1) {
        this.updateUnitFrom(this.settingsService.USUNITFROM - 1);
        this.updateUnitTo(this.settingsService.USUNITFROM);
      }
    } else if (this.settingsService.USPARTFROM > 1) {
      this.updatePartFrom(this.settingsService.USPARTFROM - 1);
      this.updateUnitPartTo();
    } else if (this.settingsService.USUNITFROM > 1) {
      this.updateUnitFrom(this.settingsService.USUNITFROM - 1);
      this.updatePartFrom(this.settingsService.partCount);
      this.updateUnitPartTo();
    }
  };

  nextUnitPart = (event: any) => {
    if (this.state.toType === 0) {
      if (this.settingsService.USUNITFROM < this.settingsService.unitCount) {
        this.updateUnitFrom(this.settingsService.USUNITFROM + 1);
        this.updateUnitTo(this.settingsService.USUNITFROM);
      }
    } else if (this.settingsService.USPARTFROM < this.settingsService.partCount) {
      this.updatePartFrom(this.settingsService.USPARTFROM + 1);
      this.updateUnitPartTo();
    } else if (this.settingsService.USUNITFROM < this.settingsService.unitCount) {
      this.updateUnitFrom(this.settingsService.USUNITFROM + 1);
      this.updatePartFrom(1);
      this.updateUnitPartTo();
    }
  };

  onUnitToChange = (event: any) => {
    const index = event.target.selectedIndex;
    if (!this.updateUnitTo(this.settingsService.units[index].value, false)) return;
    if (this.state.toType === 1 || this.settingsService.isInvalidUnitPart)
      this.updateUnitPartFrom();
  };

  onPartToChange = (event: any) => {
    const index = event.target.selectedIndex;
    if (!this.updatePartTo(this.settingsService.parts[index].value, false)) return;
    if (this.state.toType === 1 || this.settingsService.isInvalidUnitPart)
      this.updateUnitPartFrom();
  };

  updateTextbook() {
    const toType = this.settingsService.isSingleUnit ? 0 : this.settingsService.isSingleUnitPart ? 1 : 2;
    this.setState({toType});
    this.updateServiceState();
  }

  updateServiceState() {
    this.setState({settingsService: this.settingsService});
  }

  updateUnitPartFrom() {
    this.updateUnitFrom(this.settingsService.USUNITTO);
    this.updatePartFrom(this.settingsService.USPARTTO);
  }

  updateUnitPartTo() {
    this.updateUnitTo(this.settingsService.USUNITFROM);
    this.updatePartTo(this.settingsService.USPARTFROM);
  }

  updateSingleUnit() {
    this.updateUnitTo(this.settingsService.USUNITFROM);
    this.updatePartFrom(1);
    this.updatePartTo(this.settingsService.partCount);
  }

  updateUnitFrom(v: number, check: boolean = true): boolean {
    if (check && this.settingsService.USUNITFROM === v) return false;
    this.settingsService.USUNITFROM = v;
    this.settingsService.updateUnitFrom().subscribe(_ => this.updateServiceState());
    return true;
  }

  updatePartFrom(v: number, check: boolean = true): boolean {
    if (check && this.settingsService.USPARTFROM === v) return false;
    this.settingsService.USPARTFROM = v;
    this.settingsService.updatePartFrom().subscribe(_ => this.updateServiceState());
    return true;
  }

  updateUnitTo(v: number, check: boolean = true): boolean {
    if (check && this.settingsService.USUNITTO === v) return false;
    this.settingsService.USUNITTO = v;
    this.settingsService.updateUnitTo().subscribe(_ => this.updateServiceState());
    return true;
  }

  updatePartTo(v: number, check: boolean = true): boolean {
    if (check && this.settingsService.USPARTTO === v) return false;
    this.settingsService.USPARTTO = v;
    this.settingsService.updatePartTo().subscribe(_ => this.updateServiceState());
    return true;
  }

};
