import * as React from 'react';
import { Inject } from 'react.di';
import { SettingsListener, SettingsService } from '../../view-models/misc/settings.service';
import './Common.css'
import { Subscription } from 'rxjs';

export default class Settings extends React.Component<any, any> implements SettingsListener {
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  get toTypeIsUnit() {
    return this.settingsService.toType === 0;
  }
  get toTypeIsPart() {
    return this.settingsService.toType === 1;
  }
  get toTypeIsTo() {
    return this.settingsService.toType === 2;
  }

  componentDidMount() {
    this.settingsService.settingsListener = this;
    this.subscription.add(this.settingsService.getData().subscribe());
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    return this.settingsService.selectedLang ? (
      <div className="container mt-2">
        <div className="form-inline mb-2">
          <label htmlFor="lang" className="col-2 control-label">Language:</label>
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
          <label htmlFor="dictReference" className="col-2 control-label">Dictionary(Reference):</label>
          <select id="dictReference" className="col-4 form-control" value={this.settingsService.selectedDictReference.DICTID} onChange={this.onDictReferenceChange}>
          {
            this.settingsService.dictsReference.map(o => <option key={o.DICTID} value={o.DICTID}>{o.NAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="dictNote" className="col-2 control-label">Dictionary(Note):</label>
          <select id="dictNote" className="col-4 form-control" value={this.settingsService.selectedDictNote ? this.settingsService.selectedDictNote.ID : ''} onChange={this.onDictNoteChange}>
          {
            this.settingsService.dictsNote.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="dictTranslation" className="col-2 control-label">Dictionary(Translation):</label>
          <select id="dictTranslation" className="col-4 form-control" value={this.settingsService.selectedDictTranslation ? this.settingsService.selectedDictTranslation.ID : ''} onChange={this.onDictTranslationChange}>
            {
              this.settingsService.dictsTranslation.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
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
          <select id="toType" className="col-1 form-control" value={this.settingsService.toType} onChange={this.onToTypeChange}>
            {
              this.settingsService.toTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
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
    this.settingsService.selectedLang = this.settingsService.languages[index];
    this.settingsService.updateLang().subscribe(_ => this.updateServiceState());
  };

  onVoiceChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedVoice = this.settingsService.voices[index];
    this.subscription.add(this.settingsService.updateVoice().subscribe(_ => this.updateServiceState()));
  };

  onDictReferenceChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictReference = this.settingsService.dictsReference[index];
    this.subscription.add(this.settingsService.updateDictReference().subscribe(_ => this.updateServiceState()));
  };

  onDictNoteChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictNote = this.settingsService.dictsNote[index];
    this.subscription.add(this.settingsService.updateDictNote().subscribe(_ => this.updateServiceState()));
  };

  onDictTranslationChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictTranslation = this.settingsService.dictsTranslation[index];
    this.subscription.add(this.settingsService.updateDictTranslation().subscribe(_ => this.updateServiceState()));
  };

  onTextbookChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedTextbook = this.settingsService.textbooks[index];
    this.subscription.add(this.settingsService.updateTextbook().subscribe(_ => this.updateServiceState()));
  };

  onUnitFromChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.updateUnitFrom(this.settingsService.units[index].value).subscribe(_ => this.updateServiceState()));
  };

  onPartFromChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.updatePartFrom(this.settingsService.parts[index].value).subscribe(_ => this.updateServiceState()));
  };

  onToTypeChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.updateToType(this.settingsService.toTypes[index].value).subscribe(_ => this.updateServiceState()));
  };

  previousUnitPart = (event: any) => {
    this.subscription.add(this.settingsService.previousUnitPart().subscribe(_ => this.updateServiceState()));
  };

  nextUnitPart = (event: any) => {
    this.subscription.add(this.settingsService.nextUnitPart().subscribe(_ => this.updateServiceState()));
  };

  onUnitToChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.updateUnitTo(this.settingsService.units[index].value).subscribe(_ => this.updateServiceState()));
  };

  onPartToChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.updateUnitTo(this.settingsService.parts[index].value).subscribe(_ => this.updateServiceState()));
  };

  updateServiceState() {
    this.setState({settingsService: this.settingsService});
  }

  onGetData(): void {
  }

  onUpdateDictReference(): void {
  }

  onUpdateDictNote(): void {
  }

  onUpdateDictTranslation(): void {
  }

  onUpdateLang(): void {
  }

  onUpdatePartFrom(): void {
  }

  onUpdatePartTo(): void {
  }

  onUpdateTextbook(): void {
  }

  onUpdateUnitFrom(): void {
  }

  onUpdateUnitTo(): void {
  }

  onUpdateVoice(): void {
  }
};
