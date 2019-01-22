import * as React from 'react';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';
import './Common.css'
import { Subscription } from 'rxjs';

export default class Settings extends React.Component<any, any> {
  @Inject settingsService: SettingsService;
  subscription = new Subscription();

  get unitFrom() {
    return this.settingsService.units[this.settingsService.USUNITFROM - 1];
  }
  get partFrom() {
    return this.settingsService.parts[this.settingsService.USPARTFROM - 1];
  }
  get unitTo() {
    return this.settingsService.units[this.settingsService.USUNITTO - 1];
  }
  get partTo() {
    return this.settingsService.parts[this.settingsService.USPARTTO - 1];
  }

  state = {
    unitPartTo: false,
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
            this.settingsService.languages.map(lang => <option key={lang.ID} value={lang.ID}>{lang.NAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="dictPicker" className="col-2 control-label">Dictionary(Word):</label>
          <select id="dictPicker" className="col-4 form-control" value={this.settingsService.selectedDictPicker.DICTID} onChange={this.onDictPickerChange}>
          {
            this.settingsService.dictsPicker.map(dict => <option key={dict.DICTID} value={dict.DICTID}>{dict.DICTNAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="dictNote" className="col-2 control-label">Dictionary(Note):</label>
          <select id="dictNote" className="col-4 form-control" value={this.settingsService.selectedDictNote ? this.settingsService.selectedDictNote.ID : ''} onChange={this.onDictNoteChange}>
          {
            this.settingsService.dictsNote.map(dict => <option key={dict.ID} value={dict.ID}>{dict.DICTNAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="textbook" className="col-2 control-label">Textbook:</label>
          <select id="textbook" className="col-4 form-control" value={this.settingsService.selectedTextbook.ID} onChange={this.onTextbookChange}>
          {
            this.settingsService.textbooks.map(textbook => <option key={textbook.ID} value={textbook.ID}>{textbook.NAME}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="unitFrom" className="col-2 control-label">Unit:</label>
          <select id="unitFrom" className="col-2 form-control" value={this.unitFrom} onChange={this.onUnitFromChange}>
          {
            this.settingsService.units.map(unit => <option key={unit} value={unit}>{unit}</option>)
          }
          </select>
          <select className="col-2 form-control" value={this.partFrom} onChange={this.onPartFromChange}>
          {
            this.settingsService.parts.map(part => <option key={part} value={part}>{part}</option>)
          }
          </select>
        </div>
        <div className="form-inline mb-2">
          <label htmlFor="unitTo" className="col-2 control-label">
            <input type="checkbox" checked={this.state.unitPartTo} onChange={this.onUnitPartToChange}/>To:
          </label>
          <select id="unitTo" className="col-2 form-control" disabled={!this.state.unitPartTo} value={this.unitTo} onChange={this.onUnitToChange}>
          {
            this.settingsService.units.map(unit => <option key={unit} value={unit}>{unit}</option>)
          }
          </select>
          <select className="col-2 form-control" disabled={!this.state.unitPartTo} value={this.partTo} onChange={this.onPartToChange}>
            {
              this.settingsService.parts.map(part => <option key={part} value={part}>{part}</option>)
            }
          </select>
        </div>
      </div>
    ) : (<div/>);
  }

  onLangChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.subscription.add(this.settingsService.setSelectedLangIndex(index).subscribe(_ => this.updateServiceState()));
    this.settingsService.updateLang().subscribe();
  };

  onDictPickerChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictPickerIndex = index;
    this.subscription.add(this.settingsService.updateDictPicker().subscribe(_ => this.updateServiceState()));
  };

  onDictNoteChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictNoteIndex = index;
    this.subscription.add(this.settingsService.updateDictNote().subscribe(_ => this.updateServiceState()));
  };

  onTextbookChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedTextbookIndex = index;
    this.subscription.add(this.settingsService.updateTextbook().subscribe(_ => this.updateServiceState()));
    this.updateTextbook();
  };

  onUnitFromChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USUNITFROM = value;
    this.subscription.add(this.settingsService.updateUnitFrom()
      .subscribe(_ => {
        if (!this.state.unitPartTo || this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartTo();
        }
        this.updateServiceState();
      }));
  };

  onPartFromChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USPARTFROM = value;
    this.subscription.add(this.settingsService.updatePartFrom()
      .subscribe(_ => {
        if (!this.state.unitPartTo || this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartTo();
        }
        this.updateServiceState();
      }));
  };

  onUnitPartToChange = (event: any) => {
    this.setState({unitPartTo: !this.state.unitPartTo});
    this.updateServiceState();
  };

  onUnitToChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USUNITTO = value;
    this.subscription.add(this.settingsService.updateUnitTo()
      .subscribe(_ => {
        if (this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartFrom();
        }
        this.updateServiceState();
      }));
  };

  onPartToChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USPARTTO = value;
    this.subscription.add(this.settingsService.updatePartTo()
      .subscribe(_ => {
        if (this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartFrom();
        }
        this.updateServiceState();
      }));
  };

  updateTextbook() {
    this.setState({unitPartTo: !this.settingsService.isSingleUnitPart});
    this.updateServiceState();
  }

  updateUnitPartFrom() {
    if (this.settingsService.USUNITFROM !== this.settingsService.USUNITTO) {
      this.settingsService.USUNITFROM = this.settingsService.USUNITTO;
      this.settingsService.updateUnitFrom().subscribe();
    }
    if (this.settingsService.USPARTFROM !== this.settingsService.USPARTTO) {
      this.settingsService.USPARTFROM = this.settingsService.USPARTTO;
      this.settingsService.updatePartFrom().subscribe();
    }
    this.updateServiceState();
  }

  updateUnitPartTo() {
    if (this.settingsService.USUNITTO !== this.settingsService.USUNITFROM) {
      this.settingsService.USUNITTO = this.settingsService.USUNITFROM;
      this.settingsService.updateUnitTo().subscribe();
    }
    if (this.settingsService.USPARTTO !== this.settingsService.USPARTFROM) {
      this.settingsService.USPARTTO = this.settingsService.USPARTFROM;
      this.settingsService.updatePartTo().subscribe();
    }
    this.updateServiceState();
  }

  updateServiceState() {
    this.setState({settingsService: this.settingsService});
  }

};
