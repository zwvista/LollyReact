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
import { InputNumber } from "primereact/inputnumber";

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
    <div>
      <div className="p-grid mt-2 mb-2">
        <label className="p-col-1" htmlFor="ID">ID:</label>
        <InputNumber className="p-col-3" id="ID" value={item.ID} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="UNIT">UNIT:</label>
        <Dropdown className="p-col-3" id="UNIT" options={settingsService.units} value={item.UNIT} onChange={onChangeDropDown} />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="PART">PART:</label>
        <Dropdown className="p-col-3" id="PART" options={settingsService.parts} value={item.PART} onChange={onChangeDropDown} />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="SEQNUM">SEQNUM:</label>
        <InputNumber className="p-col-3" id="SEQNUM" value={item.SEQNUM} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="WORDID">WORDID:</label>
        <InputNumber className="p-col-3" id="WORDID" value={item.WORDID} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="WORD">WORD:</label>
        <InputText className="p-col-3" id="WORD" value={item.WORD} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="NOTE">NOTE:</label>
        <InputText className="p-col-3" id="NOTE" value={item.NOTE} onChange={onChangeInput} />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="FAMIID">FAMIID:</label>
        <InputNumber className="p-col-3" id="FAMIID" value={item.FAMIID} disabled />
      </div>
      <div className="p-grid mb-2">
        <label className="p-col-1" htmlFor="ACCURACY">ACCURACY:</label>
        <InputText className="p-col-3" id="ACCURACY" value={item.ACCURACY} disabled />
      </div>
      <div>
        <Button label="Back" onClick={goBack} />
        <Button label="Save" onClick={save} />
      </div>
    </div>
  );
}
