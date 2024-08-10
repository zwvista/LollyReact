import * as React from 'react';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsListener, SettingsService } from '../../view-models/misc/settings.service';
import './Common.css'
import { useEffect, useMemo, useReducer } from "react";

export default function Settings() {
  const settingsService = container.resolve(SettingsService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const toTypeIsUnit = useMemo(() => settingsService.toType === 0, [settingsService.toType]);
  const toTypeIsPart = useMemo(() => settingsService.toType === 1, [settingsService.toType]);
  const toTypeIsTo = useMemo(() => settingsService.toType === 2, [settingsService.toType]);

  const onLangChange = async (event: any) => {
    console.log(event);
    const index = event.target.selectedIndex;
    settingsService.selectedLang = settingsService.languages[index];
    await settingsService.updateLang();
    forceUpdate();
  };

  const onVoiceChange = async (event: any) => {
    const index = event.target.selectedIndex;
    settingsService.selectedVoice = settingsService.voices[index];
    await settingsService.updateVoice();
    forceUpdate();
  };

  const onDictReferenceChange = async (event: any) => {
    const index = event.target.selectedIndex;
    settingsService.selectedDictReference = settingsService.dictsReference[index];
    await settingsService.updateDictReference();
    forceUpdate();
  };

  const onDictNoteChange = async (event: any) => {
    const index = event.target.selectedIndex;
    settingsService.selectedDictNote = settingsService.dictsNote[index];
    await settingsService.updateDictNote();
    forceUpdate();
  };

  const onDictTranslationChange = async (event: any) => {
    const index = event.target.selectedIndex;
    settingsService.selectedDictTranslation = settingsService.dictsTranslation[index];
    await settingsService.updateDictTranslation();
    forceUpdate();
  };

  const onTextbookChange = async (event: any) => {
    const index = event.target.selectedIndex;
    settingsService.selectedTextbook = settingsService.textbooks[index];
    await settingsService.updateTextbook();
    forceUpdate();
  };

  const onUnitFromChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await settingsService.updateUnitFrom(settingsService.units[index].value);
    forceUpdate();
  };

  const onPartFromChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await settingsService.updatePartFrom(settingsService.parts[index].value);
    forceUpdate();
  };

  const onToTypeChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await settingsService.updateToType(settingsService.toTypes[index].value);
    forceUpdate();
  };

  const previousUnitPart = async (event: any) => {
    await settingsService.previousUnitPart();
    forceUpdate();
  };

  const nextUnitPart = async (event: any) => {
    await settingsService.nextUnitPart();
    forceUpdate();
  };

  const onUnitToChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await settingsService.updateUnitTo(settingsService.units[index].value);
    forceUpdate();
  };

  const onPartToChange = async (event: any) => {
    const index = event.target.selectedIndex;
    await settingsService.updateUnitTo(settingsService.parts[index].value);
    forceUpdate();
  };

  useEffect(() => {
    (async () => {
      await settingsService.getData();
      forceUpdate();
    })();
  },[]);

  return settingsService.selectedLang ? (
    <div className="container mt-2">
      <div className="form-inline mb-2">
        <label htmlFor="lang" className="col-2 control-label">Language:</label>
        <select id="lang" className="col-4 form-control" value={settingsService.selectedLang.ID} onChange={onLangChange}>
        {
          settingsService.languages.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label htmlFor="voice" className="col-2 control-label">Voice:</label>
        <select id="voice" className="col-4 form-control" value={settingsService.selectedVoice ? settingsService.selectedVoice.ID : ''} onChange={onVoiceChange}>
          {
            settingsService.voices.map(o => <option key={o.ID} value={o.ID}>{o.VOICENAME}</option>)
          }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label htmlFor="dictReference" className="col-2 control-label">Dictionary(Reference):</label>
        <select id="dictReference" className="col-4 form-control" value={settingsService.selectedDictReference?.DICTID} onChange={onDictReferenceChange}>
        {
          settingsService.dictsReference.map(o => <option key={o.DICTID} value={o.DICTID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label htmlFor="dictNote" className="col-2 control-label">Dictionary(Note):</label>
        <select id="dictNote" className="col-4 form-control" value={settingsService.selectedDictNote ? settingsService.selectedDictNote.ID : ''} onChange={onDictNoteChange}>
        {
          settingsService.dictsNote.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label htmlFor="dictTranslation" className="col-2 control-label">Dictionary(Translation):</label>
        <select id="dictTranslation" className="col-4 form-control" value={settingsService.selectedDictTranslation ? settingsService.selectedDictTranslation.ID : ''} onChange={onDictTranslationChange}>
          {
            settingsService.dictsTranslation.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
          }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label htmlFor="textbook" className="col-2 control-label">Textbook:</label>
        <select id="textbook" className="col-4 form-control" value={settingsService.selectedTextbook?.ID} onChange={onTextbookChange}>
        {
          settingsService.textbooks.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label htmlFor="unitFrom" className="col-2 control-label">Unit:</label>
        <select id="unitFrom" className="col-2 form-control" value={settingsService.USUNITFROM} onChange={onUnitFromChange}>
        {
          settingsService.units.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
        </select>
        <select id="partFrom" className="col-2 form-control" disabled={toTypeIsUnit} value={settingsService.USPARTFROM} onChange={onPartFromChange}>
        {
          settingsService.parts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
        </select>
      </div>
      <div className="form-inline mb-2">
        <select id="toType" className="col-1 form-control" value={settingsService.toType} onChange={onToTypeChange}>
          {
            settingsService.toTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
        </select>
        <label className="col-1 control-label" />
        <select id="unitTo" className="col-2 form-control" disabled={!toTypeIsTo} value={settingsService.USUNITTO} onChange={onUnitToChange}>
        {
          settingsService.units.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
        </select>
        <select id="partTo" className="col-2 form-control" disabled={!toTypeIsTo} value={settingsService.USPARTTO} onChange={onPartToChange}>
          {
            settingsService.parts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
        </select>
      </div>
      <div className="form-inline mb-2">
        <label className="col-2 control-label" />
        <button className="btn btn-primary mr-2" disabled={toTypeIsTo} onClick={previousUnitPart}>Previous</button>
        <button className="btn btn-primary mr-2" disabled={toTypeIsTo} onClick={nextUnitPart}>Next</button>
      </div>
    </div>
  ) : (<div/>);
};
