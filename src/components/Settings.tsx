import * as React from 'react';
import { Inject } from 'react.di';
import { SettingsService } from '../view-models/settings.service';

export default class Settings extends React.Component<any, any> {
  @Inject settingsService: SettingsService;

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

  unitPartTo: boolean;

  componentDidMount() {
    this.settingsService.getData().subscribe(_ => this.updateTextbook());
  }

  render() {
    return this.settingsService.selectedLang ? (
      <div className="container">
        <div className="row">
          <label className="col-2 control-label">Languages:</label>
          <select className="col-4 form-control" value={this.settingsService.selectedLang.ID} onChange={this.onLangChange}>
          {
            this.settingsService.languages.map(lang => <option key={lang.ID} value={lang.ID}>{lang.NAME}</option>)
          }
          </select>
        </div>
        <div className="row">
          <label className="col-2 control-label">Dictionary(Online):</label>
          <select className="col-4 form-control" value={this.settingsService.selectedDictOnline.ID} onChange={this.onDictOnlineChange}>
          {
            this.settingsService.dictsOnline.map(dict => <option key={dict.ID} value={dict.ID}>{dict.DICTNAME}</option>)
          }
          </select>
        </div>
        <div className="row">
          <label className="col-2 control-label">Dictionary(Note):</label>
          <select className="col-4 form-control" value={this.settingsService.selectedDictNote && this.settingsService.selectedDictNote.ID} onChange={this.onDictNoteChange}>
          {
            this.settingsService.dictsNote.map(dict => <option key={dict.ID} value={dict.ID}>{dict.DICTNAME}</option>)
          }
          </select>
        </div>
        <div className=" row">
          <label className="col-2 control-label">Textbook:</label>
          <select className="col-4 form-control" value={this.settingsService.selectedTextbook.ID} onChange={this.onTextbookChange}>
          {
            this.settingsService.textbooks.map(textbook => <option key={textbook.ID} value={textbook.ID}>{textbook.NAME}</option>)
          }
          </select>
        </div>
        <div className="row">
          <label className="col-2 control-label">Unit:</label>
          <select className="col-2 form-control" value={this.unitFrom} onChange={this.onUnitFromChange}>
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
        <div className="row">
          <label className="col-2 control-label">
            <input type="checkbox" checked={this.unitPartTo}/>To:
          </label>
          <select className="col-2 form-control" disabled={!this.unitPartTo} value={this.unitTo} onChange={this.onUnitToChange}>
          {
            this.settingsService.units.map(unit => <option key={unit} value={unit}>{unit}</option>)
          }
          </select>
          <select className="col-2 form-control" disabled={!this.unitPartTo} value={this.partTo} onChange={this.onPartToChange}>
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
    this.settingsService.setSelectedLangIndex(index).subscribe();
    this.settingsService.updateLang().subscribe();
  };

  onDictOnlineChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictOnlineIndex = index;
    this.settingsService.updateDictOnline().subscribe();
  };

  onDictNoteChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedDictNoteIndex = index;
    this.settingsService.updateDictNote().subscribe();
  };

  onTextbookChange = (event: any) => {
    const index = event.target.selectedIndex;
    this.settingsService.selectedTextbookIndex = index;
    this.settingsService.updateTextbook().subscribe();
    this.updateTextbook();
  };

  onUnitFromChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USUNITFROM = value;
    this.settingsService.updateUnitFrom()
      .subscribe(_ => {
        if (!this.unitPartTo || this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartTo();
        }
      });
  };

  onPartFromChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USPARTFROM = value;
    this.settingsService.updatePartFrom()
      .subscribe(_ => {
        if (!this.unitPartTo || this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartTo();
        }
      });
  };

  onUnitToChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USUNITTO = value;
    this.settingsService.updateUnitTo()
      .subscribe(_ => {
        if (this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartFrom();
        }
      });
  };

  onPartToChange = (event: any) => {
    const value = +event.target.value;
    this.settingsService.USPARTTO = value;
    this.settingsService.updatePartTo()
      .subscribe(_ => {
        if (this.settingsService.isInvalidUnitPart) {
          this.updateUnitPartFrom();
        }
      });
  };

  updateTextbook() {
    this.unitPartTo = !this.settingsService.isSingleUnitPart;
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
  }

};
