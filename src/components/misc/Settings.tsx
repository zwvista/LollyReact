import * as React from 'react';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsListener, SettingsService } from '../../view-models/misc/settings.service';
import './Common.css'

export default class Settings extends React.Component<any, any> implements SettingsListener {
  settingsService = container.resolve(SettingsService);

  get toTypeIsUnit() {
    return this.settingsService.toType === 0;
  }
  get toTypeIsPart() {
    return this.settingsService.toType === 1;
  }
  get toTypeIsTo() {
    return this.settingsService.toType === 2;
  }

  async componentDidMount() {
    this.settingsService.settingsListener = this;
    await this.settingsService.getData();
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
          <select id="dictReference" className="col-4 form-control" value={this.settingsService.selectedDictReference?.DICTID} onChange={this.onDictReferenceChange}>
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
          <select id="textbook" className="col-4 form-control" value={this.settingsService.selectedTextbook?.ID} onChange={this.onTextbookChange}>
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

  onLangChange = async (event: any) => {
    console.log(event);
    const index = event.target.selectedIndex;
    this.settingsService.selectedLang = this.settingsService.languages[index];
    await this.settingsService.updateLang();
    this.updateServiceState();
  };

  onVoiceChange = async (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedVoice = this.settingsService.voices[index];
    await this.settingsService.updateVoice();
    this.updateServiceState();
  };

  onDictReferenceChange = async (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictReference = this.settingsService.dictsReference[index];
    await this.settingsService.updateDictReference();
    this.updateServiceState();
  };

  onDictNoteChange = async (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictNote = this.settingsService.dictsNote[index];
    await this.settingsService.updateDictNote();
    this.updateServiceState();
  };

  onDictTranslationChange = async (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictTranslation = this.settingsService.dictsTranslation[index];
    await this.settingsService.updateDictTranslation();
    this.updateServiceState();
  };

  onTextbookChange = async (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedTextbook = this.settingsService.textbooks[index];
    await this.settingsService.updateTextbook();
    this.updateServiceState();
  };

  onUnitFromChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await this.settingsService.updateUnitFrom(this.settingsService.units[index].value);
    this.updateServiceState();
  };

  onPartFromChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await this.settingsService.updatePartFrom(this.settingsService.parts[index].value);
    this.updateServiceState();
  };

  onToTypeChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await this.settingsService.updateToType(this.settingsService.toTypes[index].value);
    this.updateServiceState();
  };

  previousUnitPart = async (event: any) => {
    await this.settingsService.previousUnitPart();
    this.updateServiceState();
  };

  nextUnitPart = async (event: any) => {
    await this.settingsService.nextUnitPart();
    this.updateServiceState();
  };

  onUnitToChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await this.settingsService.updateUnitTo(this.settingsService.units[index].value);
    this.updateServiceState();
  };

  onPartToChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await this.settingsService.updateUnitTo(this.settingsService.parts[index].value);
    this.updateServiceState();
  };

  updateServiceState() {
    this.setState({settingsService: this.settingsService});
  }

  onGetData(): void {
  }

  onUpdateDictReference(): void {
    this.updateServiceState();
  }

  onUpdateDictNote(): void {
    this.updateServiceState();
  }

  onUpdateDictTranslation(): void {
    this.updateServiceState();
  }

  onUpdateLang(): void {
    this.updateServiceState();
  }

  onUpdatePartFrom(): void {
    this.updateServiceState();
  }

  onUpdatePartTo(): void {
    this.updateServiceState();
  }

  onUpdateTextbook(): void {
    this.updateServiceState();
  }

  onUpdateUnitFrom(): void {
    this.updateServiceState();
  }

  onUpdateUnitTo(): void {
    this.updateServiceState();
  }

  onUpdateVoice(): void {
    this.updateServiceState();
  }
};
