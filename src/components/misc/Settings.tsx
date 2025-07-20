import * as React from 'react';
import { container } from "tsyringe";
import { SettingsService } from '../../shared/view-models/misc/settings.service';
import './Common.css'
import { ChangeEvent, MouseEvent, useEffect, useMemo, useReducer } from "react";

export default function Settings() {
  const settingsService = container.resolve(SettingsService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const toTypeIsUnit = useMemo(() => settingsService.toType === 0, [settingsService.toType]);
  const toTypeIsPart = useMemo(() => settingsService.toType === 1, [settingsService.toType]);
  const toTypeIsTo = useMemo(() => settingsService.toType === 2, [settingsService.toType]);

  const onLangChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e);
    const index = e.target.selectedIndex;
    settingsService.selectedLang = settingsService.languages[index];
    await settingsService.updateLang();
    forceUpdate();
  };

  const onVoiceChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    settingsService.selectedVoice = settingsService.voices[index];
    await settingsService.updateVoice();
    forceUpdate();
  };

  const onDictReferenceChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    settingsService.selectedDictReference = settingsService.dictsReference[index];
    await settingsService.updateDictReference();
    forceUpdate();
  };

  const onDictNoteChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    settingsService.selectedDictNote = settingsService.dictsNote[index];
    await settingsService.updateDictNote();
    forceUpdate();
  };

  const onDictTranslationChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    settingsService.selectedDictTranslation = settingsService.dictsTranslation[index];
    await settingsService.updateDictTranslation();
    forceUpdate();
  };

  const onTextbookChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    settingsService.selectedTextbook = settingsService.textbooks[index];
    await settingsService.updateTextbook();
    forceUpdate();
  };

  const onUnitFromChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    await settingsService.updateUnitFrom(settingsService.units[index].value);
    forceUpdate();
  };

  const onPartFromChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    await settingsService.updatePartFrom(settingsService.parts[index].value);
    forceUpdate();
  };

  const onToTypeChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    await settingsService.updateToType(settingsService.toTypes[index].value);
    forceUpdate();
  };

  const previousUnitPart = async (e: MouseEvent) => {
    await settingsService.previousUnitPart();
    forceUpdate();
  };

  const nextUnitPart = async (e: MouseEvent) => {
    await settingsService.nextUnitPart();
    forceUpdate();
  };

  const onUnitToChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    await settingsService.updateUnitTo(settingsService.units[index].value);
    forceUpdate();
  };

  const onPartToChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const index = e.target.selectedIndex;
    await settingsService.updateUnitTo(settingsService.parts[index].value);
    forceUpdate();
  };

  useEffect(() => {
    (async () => {
      await settingsService.getData();
      forceUpdate();
    })();
  },[]);

  return !settingsService.selectedLang ? (<div/>) : (
    <div className="container mt-2">
      <div className="row mb-2">
        <label htmlFor="lang" className="col-2 align-content-center">Language:</label>
        <select id="lang" className="col" value={settingsService.selectedLang.ID} onChange={onLangChange}>
        {
          settingsService.languages.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="row mb-2">
        <label htmlFor="voice" className="col-2 align-content-center">Voice:</label>
        <select id="voice" className="col" value={settingsService.selectedVoice ? settingsService.selectedVoice.ID : ''} onChange={onVoiceChange}>
          {
            settingsService.voices.map(o => <option key={o.ID} value={o.ID}>{o.VOICENAME}</option>)
          }
        </select>
      </div>
      <div className="row mb-2">
        <label htmlFor="dictReference" className="col-2 align-content-center">Dictionary(Reference):</label>
        <select id="dictReference" className="col" value={settingsService.selectedDictReference?.DICTID} onChange={onDictReferenceChange}>
        {
          settingsService.dictsReference.map(o => <option key={o.DICTID} value={o.DICTID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="row mb-2">
        <label htmlFor="dictNote" className="col-2 align-content-center">Dictionary(Note):</label>
        <select id="dictNote" className="col" value={settingsService.selectedDictNote ? settingsService.selectedDictNote.ID : ''} onChange={onDictNoteChange}>
        {
          settingsService.dictsNote.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="row mb-2">
        <label htmlFor="dictTranslation" className="col-2 align-content-center">Dictionary(Translation):</label>
        <select id="dictTranslation" className="col" value={settingsService.selectedDictTranslation ? settingsService.selectedDictTranslation.ID : ''} onChange={onDictTranslationChange}>
          {
            settingsService.dictsTranslation.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
          }
        </select>
      </div>
      <div className="row mb-2">
        <label htmlFor="textbook" className="col-2 align-content-center">Textbook:</label>
        <select id="textbook" className="col" value={settingsService.selectedTextbook?.ID} onChange={onTextbookChange}>
        {
          settingsService.textbooks.map(o => <option key={o.ID} value={o.ID}>{o.NAME}</option>)
        }
        </select>
      </div>
      <div className="row mb-2">
        <label htmlFor="unitFrom" className="col-2 align-content-center">Unit:</label>
        <select id="unitFrom" className="col" value={settingsService.USUNITFROM} onChange={onUnitFromChange}>
        {
          settingsService.units.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
        </select>
        <select id="partFrom" className="col" disabled={toTypeIsUnit} value={settingsService.USPARTFROM} onChange={onPartFromChange}>
        {
          settingsService.parts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
        </select>
      </div>
      <div className="row mb-2">
        <select id="toType" className="col-2" value={settingsService.toType} onChange={onToTypeChange}>
          {
            settingsService.toTypes.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
        </select>
        <select id="unitTo" className="col" disabled={!toTypeIsTo} value={settingsService.USUNITTO} onChange={onUnitToChange}>
        {
          settingsService.units.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
        }
        </select>
        <select id="partTo" className="col" disabled={!toTypeIsTo} value={settingsService.USPARTTO} onChange={onPartToChange}>
          {
            settingsService.parts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)
          }
        </select>
      </div>
      <div className="row mb-2">
        <div className="col-2"></div>
        <div className="col-auto">
          <button className="btn btn-primary mr-2" disabled={toTypeIsTo} onClick={previousUnitPart}>Previous</button>
          <button className="btn btn-primary mr-2" disabled={toTypeIsTo} onClick={nextUnitPart}>Next</button>
        </div>
      </div>
    </div>
  );
}
