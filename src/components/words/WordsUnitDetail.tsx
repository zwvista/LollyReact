import * as React from 'react';
import { WordsUnitService } from '../../view-models/wpp/words-unit.service';
import { Button } from 'primereact/button';
import '../misc/Common.css'
import { InputText } from 'primereact/inputtext';
import 'reflect-metadata';
import { container } from "tsyringe";
import { SettingsService } from '../../view-models/misc/settings.service';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate, useParams } from "react-router-dom";
import { useReducer } from "react";

export default function WordsUnitDetail() {
  const wordsUnitService = container.resolve(WordsUnitService);
  const settingsService = container.resolve(SettingsService);
  const navigate = useNavigate();
  const params = useParams();
  const item = (() => {
    const id = +params.id;
    const o = wordsUnitService.unitWords.find(value => value.ID === id);
    return o || wordsUnitService.newUnitWord();
  })();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const onChangeInput = (e: any) => {
    const elem = e.nativeEvent.target as HTMLInputElement;
    item[elem.id] = elem.value;
    forceUpdate();
  };

  const onChangeDropDown = (e: any) => {
    item[e.target.id] = e.value;
    forceUpdate();
  };

  const goBack = () => {
    navigate(-1);
  };

  const save = async () => {
    item.WORD = settingsService.autoCorrectInput(item.WORD);
    if (item.ID)
      await wordsUnitService.update(item);
    else
      await wordsUnitService.create(item)
    goBack();
  };

  return (
    <div className="flex justify-content-center flex-wrap">
      <div className="w-6">
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="ID">ID:</label>
        <InputText className="col-8 w-8" id="ID" value={item.ID.toString()} disabled />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="UNIT">UNIT:</label>
        <Dropdown className="col-8" id="UNIT" options={settingsService.units} value={item.UNIT} onChange={onChangeDropDown} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="PART">PART:</label>
        <Dropdown className="col-8" id="PART" options={settingsService.parts} value={item.PART} onChange={onChangeDropDown} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="SEQNUM">SEQNUM:</label>
        <InputText className="col-8" keyfilter="int" id="SEQNUM" value={item.SEQNUM.toString()} onChange={onChangeInput} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="WORDID">WORDID:</label>
        <InputText className="col-8" id="WORDID" value={item.WORDID.toString()} disabled />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="WORD">WORD:</label>
        <InputText className="col-8" id="WORD" value={item.WORD} onChange={onChangeInput} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="NOTE">NOTE:</label>
        <InputText className="col-8" id="NOTE" value={item.NOTE} onChange={onChangeInput} />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="FAMIID">FAMIID:</label>
        <InputText className="col-8" id="FAMIID" value={item.FAMIID.toString()} disabled />
      </div>
      <div className="grid mt-2 align-items-center">
        <label className="col-4" htmlFor="ACCURACY">ACCURACY:</label>
        <InputText className="col-8" id="ACCURACY" value={item.ACCURACY} disabled />
      </div>
      <div className="mt-4 flex justify-content-around flex-wrap">
        <Button className="border-round" label="Back" onClick={goBack} />
        <Button className="border-round" label="Save" onClick={save} />
      </div>
      </div>
    </div>
  );
}
